<?php

namespace App\Service;

use App\Entity\Plan;
use App\Entity\Subscription;
use App\Entity\User;
use App\Repository\PlanRepository;
use App\Repository\SubscriptionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Stripe\Checkout\Session;
use Stripe\Customer;
use Stripe\Exception\ApiErrorException;
use Stripe\Stripe;
use Stripe\Subscription as StripeSubscription;
use Stripe\Webhook;

class StripeService
{
    public function __construct(
        private readonly string $stripeSecretKey,
        private readonly string $stripeWebhookSecret,
        private readonly string $frontendUrl,
        private readonly EntityManagerInterface $entityManager,
        private readonly PlanRepository $planRepository,
        private readonly SubscriptionRepository $subscriptionRepository,
    ) {
        Stripe::setApiKey($this->stripeSecretKey);
    }

    /**
     * Create or retrieve Stripe customer for user
     */
    public function getOrCreateCustomer(User $user): Customer
    {
        if ($user->getStripeCustomerId()) {
            try {
                return Customer::retrieve($user->getStripeCustomerId());
            } catch (ApiErrorException $e) {
                // Customer doesn't exist anymore, create new one
            }
        }

        $customer = Customer::create([
            'email' => $user->getEmail(),
            'name' => $user->getFullName(),
            'metadata' => [
                'user_id' => $user->getId()->toRfc4122(),
            ],
        ]);

        $user->setStripeCustomerId($customer->id);
        $this->entityManager->flush();

        return $customer;
    }

    /**
     * Create checkout session for subscription
     */
    public function createCheckoutSession(
        User $user,
        Plan $plan,
        string $billingInterval = 'monthly'
    ): Session {
        $customer = $this->getOrCreateCustomer($user);

        $priceId = $billingInterval === 'yearly'
            ? $plan->getStripePriceIdYearly()
            : $plan->getStripePriceIdMonthly();

        if (!$priceId) {
            throw new \InvalidArgumentException(
                "Plan {$plan->getName()} has no Stripe price ID for {$billingInterval} billing"
            );
        }

        return Session::create([
            'customer' => $customer->id,
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price' => $priceId,
                'quantity' => 1,
            ]],
            'mode' => 'subscription',
            'success_url' => $this->frontendUrl . '/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => $this->frontendUrl . '/pricing?checkout=cancelled',
            'metadata' => [
                'user_id' => $user->getId()->toRfc4122(),
                'plan_id' => $plan->getId()->toRfc4122(),
                'billing_interval' => $billingInterval,
            ],
            'subscription_data' => [
                'metadata' => [
                    'user_id' => $user->getId()->toRfc4122(),
                    'plan_id' => $plan->getId()->toRfc4122(),
                ],
            ],
            'allow_promotion_codes' => true,
        ]);
    }

    /**
     * Create customer portal session for managing subscription
     */
    public function createPortalSession(User $user): \Stripe\BillingPortal\Session
    {
        $customer = $this->getOrCreateCustomer($user);

        return \Stripe\BillingPortal\Session::create([
            'customer' => $customer->id,
            'return_url' => $this->frontendUrl . '/dashboard/settings',
        ]);
    }

    /**
     * Cancel subscription
     */
    public function cancelSubscription(Subscription $subscription, bool $immediately = false): void
    {
        $stripeSubscription = StripeSubscription::retrieve($subscription->getStripeSubscriptionId());

        if ($immediately) {
            $stripeSubscription->cancel();
            $subscription->setStatus(Subscription::STATUS_CANCELED);
            $subscription->setCanceledAt(new \DateTime());
            $subscription->setEndedAt(new \DateTime());
        } else {
            $stripeSubscription->update($subscription->getStripeSubscriptionId(), [
                'cancel_at_period_end' => true,
            ]);
            $subscription->setCancelAtPeriodEnd(true);
            $subscription->setCanceledAt(new \DateTime());
        }

        $this->entityManager->flush();
    }

    /**
     * Resume a cancelled subscription
     */
    public function resumeSubscription(Subscription $subscription): void
    {
        if (!$subscription->isCancelAtPeriodEnd()) {
            throw new \LogicException('Subscription is not scheduled for cancellation');
        }

        StripeSubscription::update($subscription->getStripeSubscriptionId(), [
            'cancel_at_period_end' => false,
        ]);

        $subscription->setCancelAtPeriodEnd(false);
        $subscription->setCanceledAt(null);
        $this->entityManager->flush();
    }

    /**
     * Verify and parse webhook payload
     */
    public function constructWebhookEvent(string $payload, string $signature): \Stripe\Event
    {
        return Webhook::constructEvent(
            $payload,
            $signature,
            $this->stripeWebhookSecret
        );
    }

    /**
     * Handle checkout.session.completed event
     */
    public function handleCheckoutCompleted(array $sessionData): void
    {
        $userId = $sessionData['metadata']['user_id'] ?? null;
        $planId = $sessionData['metadata']['plan_id'] ?? null;
        $billingInterval = $sessionData['metadata']['billing_interval'] ?? 'monthly';
        $stripeSubscriptionId = $sessionData['subscription'] ?? null;

        if (!$userId || !$planId || !$stripeSubscriptionId) {
            throw new \InvalidArgumentException('Missing required metadata in session');
        }

        $user = $this->entityManager->getRepository(User::class)->findOneBy([
            'id' => $userId,
        ]);

        $plan = $this->planRepository->find($planId);

        if (!$user || !$plan) {
            throw new \InvalidArgumentException('User or Plan not found');
        }

        // Retrieve full subscription details from Stripe
        $stripeSubscription = StripeSubscription::retrieve($stripeSubscriptionId);

        // Create local subscription
        $subscription = new Subscription();
        $subscription->setUser($user);
        $subscription->setPlan($plan);
        $subscription->setStripeSubscriptionId($stripeSubscriptionId);
        $subscription->setStripePriceId($stripeSubscription->items->data[0]->price->id ?? null);
        $subscription->setStatus($stripeSubscription->status);
        $subscription->setBillingInterval($billingInterval);
        $subscription->setCurrentPeriodStart(
            (new \DateTime())->setTimestamp($stripeSubscription->current_period_start)
        );
        $subscription->setCurrentPeriodEnd(
            (new \DateTime())->setTimestamp($stripeSubscription->current_period_end)
        );

        if ($stripeSubscription->trial_start) {
            $subscription->setTrialStart(
                (new \DateTime())->setTimestamp($stripeSubscription->trial_start)
            );
        }
        if ($stripeSubscription->trial_end) {
            $subscription->setTrialEnd(
                (new \DateTime())->setTimestamp($stripeSubscription->trial_end)
            );
        }

        // Update user's plan
        $user->setPlan($plan);
        $user->setPlanStartedAt(new \DateTime());
        $user->setPlanExpiresAt($subscription->getCurrentPeriodEnd());

        $this->entityManager->persist($subscription);
        $this->entityManager->flush();
    }

    /**
     * Handle invoice.paid event (subscription renewal)
     */
    public function handleInvoicePaid(array $invoiceData): void
    {
        $stripeSubscriptionId = $invoiceData['subscription'] ?? null;

        if (!$stripeSubscriptionId) {
            return;
        }

        $subscription = $this->subscriptionRepository->findByStripeSubscriptionId($stripeSubscriptionId);

        if (!$subscription) {
            return;
        }

        // Retrieve updated subscription from Stripe
        $stripeSubscription = StripeSubscription::retrieve($stripeSubscriptionId);

        $subscription->setStatus($stripeSubscription->status);
        $subscription->setCurrentPeriodStart(
            (new \DateTime())->setTimestamp($stripeSubscription->current_period_start)
        );
        $subscription->setCurrentPeriodEnd(
            (new \DateTime())->setTimestamp($stripeSubscription->current_period_end)
        );

        // Update user's plan expiry
        $user = $subscription->getUser();
        $user->setPlanExpiresAt($subscription->getCurrentPeriodEnd());

        $this->entityManager->flush();
    }

    /**
     * Handle invoice.payment_failed event
     */
    public function handleInvoicePaymentFailed(array $invoiceData): void
    {
        $stripeSubscriptionId = $invoiceData['subscription'] ?? null;

        if (!$stripeSubscriptionId) {
            return;
        }

        $subscription = $this->subscriptionRepository->findByStripeSubscriptionId($stripeSubscriptionId);

        if (!$subscription) {
            return;
        }

        $subscription->setStatus(Subscription::STATUS_PAST_DUE);
        $this->entityManager->flush();
    }

    /**
     * Handle customer.subscription.updated event
     */
    public function handleSubscriptionUpdated(array $subscriptionData): void
    {
        $stripeSubscriptionId = $subscriptionData['id'] ?? null;

        if (!$stripeSubscriptionId) {
            return;
        }

        $subscription = $this->subscriptionRepository->findByStripeSubscriptionId($stripeSubscriptionId);

        if (!$subscription) {
            return;
        }

        $subscription->setStatus($subscriptionData['status']);
        $subscription->setCancelAtPeriodEnd($subscriptionData['cancel_at_period_end'] ?? false);

        if (isset($subscriptionData['current_period_start'])) {
            $subscription->setCurrentPeriodStart(
                (new \DateTime())->setTimestamp($subscriptionData['current_period_start'])
            );
        }
        if (isset($subscriptionData['current_period_end'])) {
            $subscription->setCurrentPeriodEnd(
                (new \DateTime())->setTimestamp($subscriptionData['current_period_end'])
            );
        }
        if (isset($subscriptionData['canceled_at'])) {
            $subscription->setCanceledAt(
                (new \DateTime())->setTimestamp($subscriptionData['canceled_at'])
            );
        }

        $this->entityManager->flush();
    }

    /**
     * Handle customer.subscription.deleted event
     */
    public function handleSubscriptionDeleted(array $subscriptionData): void
    {
        $stripeSubscriptionId = $subscriptionData['id'] ?? null;

        if (!$stripeSubscriptionId) {
            return;
        }

        $subscription = $this->subscriptionRepository->findByStripeSubscriptionId($stripeSubscriptionId);

        if (!$subscription) {
            return;
        }

        $subscription->setStatus(Subscription::STATUS_CANCELED);
        $subscription->setEndedAt(new \DateTime());

        // Reset user to free plan
        $user = $subscription->getUser();
        $freePlan = $this->planRepository->findOneBy(['slug' => 'free']);
        if ($freePlan) {
            $user->setPlan($freePlan);
        }
        $user->setPlanExpiresAt(null);

        $this->entityManager->flush();
    }
}
