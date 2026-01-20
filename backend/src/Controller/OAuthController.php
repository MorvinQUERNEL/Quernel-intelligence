<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\PlanRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[Route('/api/oauth')]
class OAuthController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private JWTTokenManagerInterface $jwtManager,
        private UserRepository $userRepository,
        private PlanRepository $planRepository,
        private UserPasswordHasherInterface $passwordHasher,
        private HttpClientInterface $httpClient,
    ) {}

    /**
     * Handle Google OAuth callback
     * Expects: { "credential": "google_id_token" }
     */
    #[Route('/google/callback', name: 'oauth_google_callback', methods: ['POST'])]
    public function googleCallback(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['credential'])) {
            return $this->json(['error' => 'Google credential required'], 400);
        }

        try {
            // Verify Google ID token
            $googleUser = $this->verifyGoogleToken($data['credential']);

            if (!$googleUser) {
                return $this->json(['error' => 'Invalid Google token'], 401);
            }

            $googleId = $googleUser['sub'];
            $email = $googleUser['email'];
            $firstName = $googleUser['given_name'] ?? '';
            $lastName = $googleUser['family_name'] ?? '';
            $avatarUrl = $googleUser['picture'] ?? null;

            // Find or create user
            $user = $this->findOrCreateOAuthUser(
                providerId: $googleId,
                provider: 'google',
                email: $email,
                firstName: $firstName,
                lastName: $lastName,
                avatarUrl: $avatarUrl
            );

            // Generate JWT token
            $token = $this->jwtManager->create($user);

            return $this->json([
                'message' => 'Connexion Google réussie',
                'token' => $token,
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'firstName' => $user->getFirstName(),
                    'lastName' => $user->getLastName(),
                    'avatarUrl' => $user->getAvatarUrl(),
                    'plan' => $user->getPlan()?->getSlug() ?? 'free',
                    'authProvider' => $user->getAuthProvider(),
                ]
            ]);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Google authentication failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Handle Apple OAuth callback
     * Expects: { "id_token": "apple_jwt", "user": { "name": { "firstName": "...", "lastName": "..." } } }
     */
    #[Route('/apple/callback', name: 'oauth_apple_callback', methods: ['POST'])]
    public function appleCallback(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['id_token'])) {
            return $this->json(['error' => 'Apple ID token required'], 400);
        }

        try {
            // Verify Apple ID token
            $appleUser = $this->verifyAppleToken($data['id_token']);

            if (!$appleUser) {
                return $this->json(['error' => 'Invalid Apple token'], 401);
            }

            $appleId = $appleUser['sub'];
            $email = $appleUser['email'] ?? null;

            // Apple only sends user info on first authentication
            $firstName = $data['user']['name']['firstName'] ?? '';
            $lastName = $data['user']['name']['lastName'] ?? '';

            // Find or create user
            $user = $this->findOrCreateOAuthUser(
                providerId: $appleId,
                provider: 'apple',
                email: $email,
                firstName: $firstName,
                lastName: $lastName,
                avatarUrl: null
            );

            // Generate JWT token
            $token = $this->jwtManager->create($user);

            return $this->json([
                'message' => 'Connexion Apple réussie',
                'token' => $token,
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'firstName' => $user->getFirstName(),
                    'lastName' => $user->getLastName(),
                    'plan' => $user->getPlan()?->getSlug() ?? 'free',
                    'authProvider' => $user->getAuthProvider(),
                ]
            ]);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Apple authentication failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Verify Google ID token using Google's tokeninfo endpoint
     */
    private function verifyGoogleToken(string $idToken): ?array
    {
        $response = $this->httpClient->request('GET', 'https://oauth2.googleapis.com/tokeninfo', [
            'query' => ['id_token' => $idToken]
        ]);

        if ($response->getStatusCode() !== 200) {
            return null;
        }

        $data = $response->toArray();

        // Verify audience matches our client ID
        $googleClientId = $_ENV['GOOGLE_CLIENT_ID'] ?? null;
        if ($googleClientId && $data['aud'] !== $googleClientId) {
            return null;
        }

        // Verify email is verified
        if (!isset($data['email_verified']) || $data['email_verified'] !== 'true') {
            return null;
        }

        return $data;
    }

    /**
     * Verify Apple ID token
     * Apple tokens are JWTs that can be verified using Apple's public keys
     */
    private function verifyAppleToken(string $idToken): ?array
    {
        // Decode JWT without verification first to get the kid
        $tokenParts = explode('.', $idToken);
        if (count($tokenParts) !== 3) {
            return null;
        }

        $payload = json_decode(base64_decode(strtr($tokenParts[1], '-_', '+/')), true);

        if (!$payload) {
            return null;
        }

        // In production, you should verify the signature using Apple's public keys
        // For now, we'll trust the token if it has required fields
        // TODO: Implement full JWT verification with Apple's public keys

        // Verify issuer
        if (($payload['iss'] ?? '') !== 'https://appleid.apple.com') {
            return null;
        }

        // Verify audience (your app's bundle ID)
        $appleBundleId = $_ENV['APPLE_BUNDLE_ID'] ?? null;
        if ($appleBundleId && ($payload['aud'] ?? '') !== $appleBundleId) {
            return null;
        }

        // Check expiration
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return null;
        }

        return $payload;
    }

    /**
     * Find existing user by OAuth provider ID or email, or create new user
     */
    private function findOrCreateOAuthUser(
        string $providerId,
        string $provider,
        ?string $email,
        string $firstName,
        string $lastName,
        ?string $avatarUrl
    ): User {
        // First, try to find by provider ID
        $user = match($provider) {
            'google' => $this->userRepository->findOneBy(['googleId' => $providerId]),
            'apple' => $this->userRepository->findOneBy(['appleId' => $providerId]),
            default => null
        };

        if ($user) {
            // Update last login
            $user->setLastLoginAt(new \DateTime());
            $this->em->flush();
            return $user;
        }

        // Try to find by email (to link accounts)
        if ($email) {
            $user = $this->userRepository->findOneBy(['email' => $email]);

            if ($user) {
                // Link OAuth account to existing user
                match($provider) {
                    'google' => $user->setGoogleId($providerId),
                    'apple' => $user->setAppleId($providerId),
                    default => null
                };

                // Update avatar if not set
                if ($avatarUrl && !$user->getAvatarUrl()) {
                    $user->setAvatarUrl($avatarUrl);
                }

                $user->setLastLoginAt(new \DateTime());
                $this->em->flush();
                return $user;
            }
        }

        // Create new user
        $freePlan = $this->planRepository->findBySlug('free');

        $user = new User();
        $user->setEmail($email ?? $providerId . '@' . $provider . '.oauth');
        $user->setFirstName($firstName ?: 'Utilisateur');
        $user->setLastName($lastName ?: $provider);
        $user->setRoles(['ROLE_USER']);
        $user->setPlan($freePlan);
        $user->setIsActive(true);
        $user->setAuthProvider($provider);
        $user->setEmailVerifiedAt(new \DateTime()); // OAuth emails are pre-verified

        if ($avatarUrl) {
            $user->setAvatarUrl($avatarUrl);
        }

        // Set provider ID
        match($provider) {
            'google' => $user->setGoogleId($providerId),
            'apple' => $user->setAppleId($providerId),
            default => null
        };

        // Generate random password (user won't need it for OAuth login)
        $randomPassword = bin2hex(random_bytes(32));
        $hashedPassword = $this->passwordHasher->hashPassword($user, $randomPassword);
        $user->setPassword($hashedPassword);

        $this->em->persist($user);
        $this->em->flush();

        return $user;
    }
}
