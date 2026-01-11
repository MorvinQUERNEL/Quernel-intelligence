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
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api')]
class AuthController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private UserPasswordHasherInterface $passwordHasher,
        private JWTTokenManagerInterface $jwtManager,
        private ValidatorInterface $validator,
        private UserRepository $userRepository,
        private PlanRepository $planRepository,
    ) {}

    #[Route('/register', name: 'api_register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Validate required fields
        if (!isset($data['email'], $data['password'], $data['firstName'], $data['lastName'])) {
            return $this->json([
                'error' => 'Missing required fields: email, password, firstName, lastName'
            ], 400);
        }

        // Check if user already exists
        $existingUser = $this->userRepository->findOneBy(['email' => $data['email']]);
        if ($existingUser) {
            return $this->json([
                'error' => 'Un compte existe deja avec cet email'
            ], 409);
        }

        // Get free plan
        $freePlan = $this->planRepository->findBySlug('free');
        if (!$freePlan) {
            return $this->json([
                'error' => 'Plan gratuit non trouve. Contactez le support.'
            ], 500);
        }

        // Create user
        $user = new User();
        $user->setEmail($data['email']);
        $user->setFirstName($data['firstName']);
        $user->setLastName($data['lastName']);
        $user->setRoles(['ROLE_USER']);
        $user->setPlan($freePlan);
        $user->setIsActive(true);

        // Hash password
        $hashedPassword = $this->passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);

        // Validate entity
        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json(['errors' => $errorMessages], 400);
        }

        // Persist
        $this->em->persist($user);
        $this->em->flush();

        // Generate JWT token
        $token = $this->jwtManager->create($user);

        return $this->json([
            'message' => 'Compte cree avec succes',
            'token' => $token,
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
                'plan' => $user->getPlan()->getSlug(),
            ]
        ], 201);
    }

    #[Route('/me', name: 'api_me', methods: ['GET'])]
    public function me(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['error' => 'Non authentifie'], 401);
        }

        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'plan' => [
                'name' => $user->getPlan()->getName(),
                'slug' => $user->getPlan()->getSlug(),
                'tokenLimit' => $user->getPlan()->getMonthlyTokens(),
            ],
            'roles' => $user->getRoles(),
            'isVerified' => $user->getEmailVerifiedAt() !== null,
            'createdAt' => $user->getCreatedAt()->format('c'),
        ]);
    }

    #[Route('/change-password', name: 'api_change_password', methods: ['POST'])]
    public function changePassword(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['error' => 'Non authentifie'], 401);
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['currentPassword'], $data['newPassword'])) {
            return $this->json([
                'error' => 'currentPassword et newPassword requis'
            ], 400);
        }

        // Verify current password
        if (!$this->passwordHasher->isPasswordValid($user, $data['currentPassword'])) {
            return $this->json([
                'error' => 'Mot de passe actuel incorrect'
            ], 400);
        }

        // Update password
        $hashedPassword = $this->passwordHasher->hashPassword($user, $data['newPassword']);
        $user->setPassword($hashedPassword);

        $this->em->flush();

        return $this->json(['message' => 'Mot de passe modifie avec succes']);
    }
}
