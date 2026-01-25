<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Repository\PlanRepository;
use App\Repository\ConversationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin')]
#[IsGranted('ROLE_ADMIN')]
class AdminController extends AbstractController
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly PlanRepository $planRepository,
        private readonly EntityManagerInterface $entityManager,
    ) {}

    /**
     * Get admin dashboard statistics
     */
    #[Route('/stats', name: 'admin_stats', methods: ['GET'])]
    public function getStats(): JsonResponse
    {
        $totalUsers = $this->userRepository->count([]);
        $activeUsers = $this->userRepository->count(['isActive' => true]);
        $proUsers = $this->userRepository->createQueryBuilder('u')
            ->join('u.plan', 'p')
            ->where('p.slug = :slug')
            ->setParameter('slug', 'pro')
            ->select('COUNT(u.id)')
            ->getQuery()
            ->getSingleScalarResult();

        // Users registered this month
        $startOfMonth = new \DateTime('first day of this month');
        $newUsersThisMonth = $this->userRepository->createQueryBuilder('u')
            ->where('u.createdAt >= :start')
            ->setParameter('start', $startOfMonth)
            ->select('COUNT(u.id)')
            ->getQuery()
            ->getSingleScalarResult();

        // Users by plan
        $usersByPlan = $this->userRepository->createQueryBuilder('u')
            ->join('u.plan', 'p')
            ->groupBy('p.slug')
            ->select('p.slug as plan, p.name as planName, COUNT(u.id) as count')
            ->getQuery()
            ->getResult();

        // Recent signups (last 7 days)
        $lastWeek = new \DateTime('-7 days');
        $recentSignups = $this->userRepository->createQueryBuilder('u')
            ->where('u.createdAt >= :start')
            ->setParameter('start', $lastWeek)
            ->orderBy('u.createdAt', 'DESC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult();

        $recentSignupsData = array_map(fn($user) => [
            'id' => $user->getId()->toRfc4122(),
            'email' => $user->getEmail(),
            'fullName' => $user->getFullName(),
            'plan' => $user->getPlan()?->getSlug() ?? 'free',
            'createdAt' => $user->getCreatedAt()->format('c'),
        ], $recentSignups);

        return $this->json([
            'totalUsers' => (int) $totalUsers,
            'activeUsers' => (int) $activeUsers,
            'proUsers' => (int) $proUsers,
            'newUsersThisMonth' => (int) $newUsersThisMonth,
            'usersByPlan' => $usersByPlan,
            'recentSignups' => $recentSignupsData,
            'revenue' => [
                'mrr' => (int) $proUsers * 50, // Estimation based on Pro users
                'currency' => 'EUR',
            ],
        ]);
    }

    /**
     * Get all users with pagination and search
     */
    #[Route('/users', name: 'admin_users', methods: ['GET'])]
    public function getUsers(Request $request): JsonResponse
    {
        $page = max(1, $request->query->getInt('page', 1));
        $limit = min(100, max(1, $request->query->getInt('limit', 20)));
        $search = $request->query->get('search', '');
        $planFilter = $request->query->get('plan', '');
        $sortBy = $request->query->get('sortBy', 'createdAt');
        $sortOrder = $request->query->get('sortOrder', 'DESC');

        $qb = $this->userRepository->createQueryBuilder('u')
            ->leftJoin('u.plan', 'p')
            ->addSelect('p');

        // Search filter
        if ($search) {
            $qb->andWhere('u.email LIKE :search OR u.firstName LIKE :search OR u.lastName LIKE :search')
               ->setParameter('search', '%' . $search . '%');
        }

        // Plan filter
        if ($planFilter) {
            $qb->andWhere('p.slug = :plan')
               ->setParameter('plan', $planFilter);
        }

        // Sorting
        $allowedSorts = ['createdAt', 'email', 'firstName', 'lastName'];
        if (in_array($sortBy, $allowedSorts)) {
            $qb->orderBy('u.' . $sortBy, $sortOrder === 'ASC' ? 'ASC' : 'DESC');
        }

        // Count total
        $countQb = clone $qb;
        $total = $countQb->select('COUNT(u.id)')->getQuery()->getSingleScalarResult();

        // Pagination
        $offset = ($page - 1) * $limit;
        $users = $qb->setFirstResult($offset)
                    ->setMaxResults($limit)
                    ->getQuery()
                    ->getResult();

        $usersData = array_map(fn($user) => $this->serializeUser($user), $users);

        return $this->json([
            'users' => $usersData,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => (int) $total,
                'totalPages' => ceil($total / $limit),
            ],
        ]);
    }

    /**
     * Get single user details
     */
    #[Route('/users/{id}', name: 'admin_user_detail', methods: ['GET'])]
    public function getUserDetail(string $id): JsonResponse
    {
        $user = $this->userRepository->find($id);

        if (!$user) {
            return $this->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $userData = $this->serializeUser($user, true);

        // Add conversations count
        $userData['conversationsCount'] = $user->getConversations()->count();
        $userData['agentsCount'] = $user->getAgents()->count();

        return $this->json($userData);
    }

    /**
     * Update user (admin actions)
     */
    #[Route('/users/{id}', name: 'admin_user_update', methods: ['PATCH'])]
    public function updateUser(string $id, Request $request): JsonResponse
    {
        $user = $this->userRepository->find($id);

        if (!$user) {
            return $this->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        // Update allowed fields
        if (isset($data['isActive'])) {
            $user->setIsActive((bool) $data['isActive']);
        }

        if (isset($data['plan'])) {
            $plan = $this->planRepository->findOneBy(['slug' => $data['plan']]);
            if ($plan) {
                $user->setPlan($plan);
            }
        }

        if (isset($data['roles']) && is_array($data['roles'])) {
            $user->setRoles($data['roles']);
        }

        $this->entityManager->flush();

        return $this->json([
            'success' => true,
            'user' => $this->serializeUser($user),
        ]);
    }

    /**
     * Delete user (soft delete - deactivate)
     */
    #[Route('/users/{id}', name: 'admin_user_delete', methods: ['DELETE'])]
    public function deleteUser(string $id): JsonResponse
    {
        $user = $this->userRepository->find($id);

        if (!$user) {
            return $this->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        // Don't allow deleting yourself
        if ($user === $this->getUser()) {
            return $this->json(['error' => 'Cannot delete your own account'], Response::HTTP_FORBIDDEN);
        }

        // Soft delete - just deactivate
        $user->setIsActive(false);
        $this->entityManager->flush();

        return $this->json([
            'success' => true,
            'message' => 'User deactivated',
        ]);
    }

    /**
     * Serialize user for API response
     */
    private function serializeUser(User $user, bool $detailed = false): array
    {
        $data = [
            'id' => $user->getId()->toRfc4122(),
            'email' => $user->getEmail(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'fullName' => $user->getFullName(),
            'avatarUrl' => $user->getAvatarUrl(),
            'roles' => $user->getRoles(),
            'isActive' => $user->isActive(),
            'plan' => $user->getPlan() ? [
                'slug' => $user->getPlan()->getSlug(),
                'name' => $user->getPlan()->getName(),
            ] : null,
            'emailVerified' => $user->getEmailVerifiedAt() !== null,
            'authProvider' => $user->getAuthProvider(),
            'createdAt' => $user->getCreatedAt()->format('c'),
            'lastLoginAt' => $user->getLastLoginAt()?->format('c'),
        ];

        if ($detailed) {
            $data['stripeCustomerId'] = $user->getStripeCustomerId();
            $data['planStartedAt'] = $user->getPlanStartedAt()?->format('c');
            $data['planExpiresAt'] = $user->getPlanExpiresAt()?->format('c');
            $data['updatedAt'] = $user->getUpdatedAt()->format('c');
        }

        return $data;
    }
}
