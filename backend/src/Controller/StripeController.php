<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\PlanRepository;
use App\Service\StripeService;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/stripe')]
class StripeController extends AbstractController
{
    public function __construct(
        private readonly StripeService $stripeService,
        private readonly PlanRepository $planRepository,
        private readonly LoggerInterface $logger,
    ) {}

    /**
     * Create checkout session for subscription
     */
    #[Route('/checkout', name: 'stripe_checkout', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function createCheckout(
        Request $request,
        #[CurrentUser] User $user
    ): JsonResponse {
        try {
            $data = json_decode($request->getContent(), true);
            $planSlug = $data['plan'] ?? null;
            $billingInterval = $data['interval'] ?? 'monthly';

            if (!$planSlug) {
                return $this->json(['error' => 'Plan is required'], Response::HTTP_BAD_REQUEST);
            }

            if (!in_array($billingInterval, ['monthly', 'yearly'])) {
                return $this->json(['error' => 'Invalid billing interval'], Response::HTTP_BAD_REQUEST);
            }

            $plan = $this->planRepository->findOneBy(['slug' => $planSlug]);

            if (!$plan) {
                return $this->json(['error' => 'Plan not found'], Response::HTTP_NOT_FOUND);
            }

            if ($plan->getSlug() === 'free') {
                return $this->json(['error' => 'Cannot checkout for free plan'], Response::HTTP_BAD_REQUEST);
            }

            if ($plan->getSlug() === 'enterprise') {
                return $this->json([
                    'error' => 'Enterprise plan requires contacting sales',
                    'contact' => 'contact@quernel-intelligence.com'
                ], Response::HTTP_BAD_REQUEST);
            }

            $session = $this->stripeService->createCheckoutSession($user, $plan, $billingInterval);

            return $this->json([
                'sessionId' => $session->id,
                'url' => $session->url,
            ]);
        } catch (\Exception $e) {
            $this->logger->error('Stripe checkout error: ' . $e->getMessage());
            return $this->json(['error' => 'Failed to create checkout session'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Create customer portal session
     */
    #[Route('/portal', name: 'stripe_portal', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function createPortal(#[CurrentUser] User $user): JsonResponse
    {
        try {
            $session = $this->stripeService->createPortalSession($user);

            return $this->json([
                'url' => $session->url,
            ]);
        } catch (\Exception $e) {
            $this->logger->error('Stripe portal error: ' . $e->getMessage());
            return $this->json(['error' => 'Failed to create portal session'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get current subscription status
     */
    #[Route('/subscription', name: 'stripe_subscription', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function getSubscription(#[CurrentUser] User $user): JsonResponse
    {
        $subscription = $user->getActiveSubscription();
        $plan = $user->getPlan();

        return $this->json([
            'plan' => $plan ? [
                'name' => $plan->getName(),
                'slug' => $plan->getSlug(),
                'priceMonthly' => $plan->getPriceMonthly(),
                'priceYearly' => $plan->getPriceYearly(),
            ] : null,
            'subscription' => $subscription ? [
                'status' => $subscription->getStatus(),
                'billingInterval' => $subscription->getBillingInterval(),
                'currentPeriodEnd' => $subscription->getCurrentPeriodEnd()?->format('c'),
                'cancelAtPeriodEnd' => $subscription->isCancelAtPeriodEnd(),
                'daysUntilRenewal' => $subscription->getDaysUntilRenewal(),
            ] : null,
        ]);
    }

    /**
     * Cancel subscription
     */
    #[Route('/subscription/cancel', name: 'stripe_cancel', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function cancelSubscription(
        Request $request,
        #[CurrentUser] User $user
    ): JsonResponse {
        try {
            $subscription = $user->getActiveSubscription();

            if (!$subscription) {
                return $this->json(['error' => 'No active subscription'], Response::HTTP_NOT_FOUND);
            }

            $data = json_decode($request->getContent(), true);
            $immediately = $data['immediately'] ?? false;

            $this->stripeService->cancelSubscription($subscription, $immediately);

            return $this->json([
                'success' => true,
                'message' => $immediately
                    ? 'Subscription cancelled immediately'
                    : 'Subscription will be cancelled at the end of the billing period',
            ]);
        } catch (\Exception $e) {
            $this->logger->error('Stripe cancel error: ' . $e->getMessage());
            return $this->json(['error' => 'Failed to cancel subscription'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Resume cancelled subscription
     */
    #[Route('/subscription/resume', name: 'stripe_resume', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function resumeSubscription(#[CurrentUser] User $user): JsonResponse
    {
        try {
            $subscription = $user->getActiveSubscription();

            if (!$subscription) {
                return $this->json(['error' => 'No active subscription'], Response::HTTP_NOT_FOUND);
            }

            if (!$subscription->isCancelAtPeriodEnd()) {
                return $this->json(['error' => 'Subscription is not scheduled for cancellation'], Response::HTTP_BAD_REQUEST);
            }

            $this->stripeService->resumeSubscription($subscription);

            return $this->json([
                'success' => true,
                'message' => 'Subscription resumed',
            ]);
        } catch (\Exception $e) {
            $this->logger->error('Stripe resume error: ' . $e->getMessage());
            return $this->json(['error' => 'Failed to resume subscription'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Stripe webhook endpoint
     */
    #[Route('/webhook', name: 'stripe_webhook', methods: ['POST'])]
    public function webhook(Request $request): Response
    {
        $payload = $request->getContent();
        $signature = $request->headers->get('stripe-signature');

        if (!$signature) {
            $this->logger->warning('Stripe webhook: Missing signature');
            return new Response('Missing signature', Response::HTTP_BAD_REQUEST);
        }

        try {
            $event = $this->stripeService->constructWebhookEvent($payload, $signature);
        } catch (\Exception $e) {
            $this->logger->error('Stripe webhook verification failed: ' . $e->getMessage());
            return new Response('Webhook verification failed', Response::HTTP_BAD_REQUEST);
        }

        $this->logger->info('Stripe webhook received: ' . $event->type);

        try {
            switch ($event->type) {
                case 'checkout.session.completed':
                    $this->stripeService->handleCheckoutCompleted($event->data->object->toArray());
                    break;

                case 'invoice.paid':
                    $this->stripeService->handleInvoicePaid($event->data->object->toArray());
                    break;

                case 'invoice.payment_failed':
                    $this->stripeService->handleInvoicePaymentFailed($event->data->object->toArray());
                    break;

                case 'customer.subscription.updated':
                    $this->stripeService->handleSubscriptionUpdated($event->data->object->toArray());
                    break;

                case 'customer.subscription.deleted':
                    $this->stripeService->handleSubscriptionDeleted($event->data->object->toArray());
                    break;

                default:
                    $this->logger->info('Unhandled webhook event: ' . $event->type);
            }
        } catch (\Exception $e) {
            $this->logger->error('Stripe webhook processing error: ' . $e->getMessage());
            return new Response('Webhook processing failed', Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new Response('Webhook handled', Response::HTTP_OK);
    }
}
