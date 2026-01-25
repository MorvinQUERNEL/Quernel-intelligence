<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\ConversationRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/user')]
class UserStatsController extends AbstractController
{
    public function __construct(
        private ConversationRepository $conversationRepository,
    ) {}

    #[Route('/stats', name: 'api_user_stats', methods: ['GET'])]
    public function getStats(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['error' => 'Non authentifie'], 401);
        }

        // Stats des conversations Symfony
        $conversations = $this->conversationRepository->findByUser($user);
        $totalConversations = count($conversations);
        $totalMessages = 0;
        $totalTokens = 0;

        foreach ($conversations as $conv) {
            $totalMessages += $conv->getMessageCount();
            $totalTokens += $conv->getTotalTokens();
        }

        // Stats du plan
        $plan = $user->getPlan();
        $tokensThisMonth = $this->conversationRepository->countTokensThisMonth($user);
        $tokenLimit = $plan ? $plan->getMonthlyTokens() : 0;

        // Subscription info
        $subscription = $user->getActiveSubscription();

        return $this->json([
            'user' => [
                'id' => $user->getId()->toRfc4122(),
                'email' => $user->getEmail(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
                'createdAt' => $user->getCreatedAt()->format('c'),
            ],
            'plan' => [
                'name' => $plan ? $plan->getName() : 'Free',
                'slug' => $plan ? $plan->getSlug() : 'free',
                'tokenLimit' => $tokenLimit,
            ],
            'usage' => [
                'tokensThisMonth' => $tokensThisMonth,
                'tokensRemaining' => $tokenLimit > 0 ? max(0, $tokenLimit - $tokensThisMonth) : null,
                'percentageUsed' => $tokenLimit > 0 ? round(($tokensThisMonth / $tokenLimit) * 100, 1) : 0,
            ],
            'conversations' => [
                'total' => $totalConversations,
                'totalMessages' => $totalMessages,
                'totalTokens' => $totalTokens,
            ],
            'subscription' => $subscription ? [
                'status' => $subscription->getStatus(),
                'billingInterval' => $subscription->getBillingInterval(),
                'currentPeriodEnd' => $subscription->getCurrentPeriodEnd()?->format('c'),
                'cancelAtPeriodEnd' => $subscription->isCancelAtPeriodEnd(),
            ] : null,
        ]);
    }

    #[Route('/usage-history', name: 'api_user_usage_history', methods: ['GET'])]
    public function getUsageHistory(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['error' => 'Non authentifie'], 401);
        }

        // Get conversations grouped by date
        $conversations = $this->conversationRepository->findByUser($user);
        $usageByDate = [];

        foreach ($conversations as $conv) {
            $date = $conv->getCreatedAt()->format('Y-m-d');
            if (!isset($usageByDate[$date])) {
                $usageByDate[$date] = [
                    'date' => $date,
                    'conversations' => 0,
                    'messages' => 0,
                    'tokens' => 0,
                ];
            }
            $usageByDate[$date]['conversations']++;
            $usageByDate[$date]['messages'] += $conv->getMessageCount();
            $usageByDate[$date]['tokens'] += $conv->getTotalTokens();
        }

        // Sort by date descending
        krsort($usageByDate);

        // Return last 30 days
        return $this->json([
            'history' => array_values(array_slice($usageByDate, 0, 30)),
        ]);
    }
}
