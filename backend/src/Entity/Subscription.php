<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Repository\SubscriptionRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: SubscriptionRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    operations: [
        new Get(security: "is_granted('ROLE_USER') and object.getUser() == user"),
        new GetCollection(security: "is_granted('ROLE_ADMIN')"),
    ],
    normalizationContext: ['groups' => ['subscription:read']],
)]
class Subscription
{
    public const STATUS_ACTIVE = 'active';
    public const STATUS_CANCELED = 'canceled';
    public const STATUS_INCOMPLETE = 'incomplete';
    public const STATUS_INCOMPLETE_EXPIRED = 'incomplete_expired';
    public const STATUS_PAST_DUE = 'past_due';
    public const STATUS_TRIALING = 'trialing';
    public const STATUS_UNPAID = 'unpaid';
    public const STATUS_PAUSED = 'paused';

    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    #[Groups(['subscription:read'])]
    private ?Uuid $id = null;

    #[ORM\ManyToOne(inversedBy: 'subscriptions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['subscription:read'])]
    private ?Plan $plan = null;

    #[ORM\Column(length: 255, unique: true)]
    private ?string $stripeSubscriptionId = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $stripePriceId = null;

    #[ORM\Column(length: 50)]
    #[Groups(['subscription:read'])]
    private ?string $status = self::STATUS_INCOMPLETE;

    #[ORM\Column(length: 20)]
    #[Groups(['subscription:read'])]
    private ?string $billingInterval = 'monthly'; // 'monthly' or 'yearly'

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['subscription:read'])]
    private ?\DateTimeInterface $currentPeriodStart = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['subscription:read'])]
    private ?\DateTimeInterface $currentPeriodEnd = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['subscription:read'])]
    private ?\DateTimeInterface $trialStart = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['subscription:read'])]
    private ?\DateTimeInterface $trialEnd = null;

    #[ORM\Column]
    #[Groups(['subscription:read'])]
    private bool $cancelAtPeriodEnd = false;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $canceledAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $endedAt = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2, nullable: true)]
    #[Groups(['subscription:read'])]
    private ?string $amount = null;

    #[ORM\Column(length: 3)]
    #[Groups(['subscription:read'])]
    private ?string $currency = 'eur';

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['subscription:read'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $updatedAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
        $this->updatedAt = new \DateTime();
    }

    public function getId(): ?Uuid
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;
        return $this;
    }

    public function getPlan(): ?Plan
    {
        return $this->plan;
    }

    public function setPlan(?Plan $plan): static
    {
        $this->plan = $plan;
        return $this;
    }

    public function getStripeSubscriptionId(): ?string
    {
        return $this->stripeSubscriptionId;
    }

    public function setStripeSubscriptionId(string $stripeSubscriptionId): static
    {
        $this->stripeSubscriptionId = $stripeSubscriptionId;
        return $this;
    }

    public function getStripePriceId(): ?string
    {
        return $this->stripePriceId;
    }

    public function setStripePriceId(?string $stripePriceId): static
    {
        $this->stripePriceId = $stripePriceId;
        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;
        return $this;
    }

    public function getBillingInterval(): ?string
    {
        return $this->billingInterval;
    }

    public function setBillingInterval(string $billingInterval): static
    {
        $this->billingInterval = $billingInterval;
        return $this;
    }

    public function getCurrentPeriodStart(): ?\DateTimeInterface
    {
        return $this->currentPeriodStart;
    }

    public function setCurrentPeriodStart(?\DateTimeInterface $currentPeriodStart): static
    {
        $this->currentPeriodStart = $currentPeriodStart;
        return $this;
    }

    public function getCurrentPeriodEnd(): ?\DateTimeInterface
    {
        return $this->currentPeriodEnd;
    }

    public function setCurrentPeriodEnd(?\DateTimeInterface $currentPeriodEnd): static
    {
        $this->currentPeriodEnd = $currentPeriodEnd;
        return $this;
    }

    public function getTrialStart(): ?\DateTimeInterface
    {
        return $this->trialStart;
    }

    public function setTrialStart(?\DateTimeInterface $trialStart): static
    {
        $this->trialStart = $trialStart;
        return $this;
    }

    public function getTrialEnd(): ?\DateTimeInterface
    {
        return $this->trialEnd;
    }

    public function setTrialEnd(?\DateTimeInterface $trialEnd): static
    {
        $this->trialEnd = $trialEnd;
        return $this;
    }

    public function isCancelAtPeriodEnd(): bool
    {
        return $this->cancelAtPeriodEnd;
    }

    public function setCancelAtPeriodEnd(bool $cancelAtPeriodEnd): static
    {
        $this->cancelAtPeriodEnd = $cancelAtPeriodEnd;
        return $this;
    }

    public function getCanceledAt(): ?\DateTimeInterface
    {
        return $this->canceledAt;
    }

    public function setCanceledAt(?\DateTimeInterface $canceledAt): static
    {
        $this->canceledAt = $canceledAt;
        return $this;
    }

    public function getEndedAt(): ?\DateTimeInterface
    {
        return $this->endedAt;
    }

    public function setEndedAt(?\DateTimeInterface $endedAt): static
    {
        $this->endedAt = $endedAt;
        return $this;
    }

    public function getAmount(): ?string
    {
        return $this->amount;
    }

    public function setAmount(?string $amount): static
    {
        $this->amount = $amount;
        return $this;
    }

    public function getCurrency(): ?string
    {
        return $this->currency;
    }

    public function setCurrency(string $currency): static
    {
        $this->currency = $currency;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): static
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeInterface $updatedAt): static
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }

    #[ORM\PreUpdate]
    public function preUpdate(): void
    {
        $this->updatedAt = new \DateTime();
    }

    // Helper methods

    public function isActive(): bool
    {
        return in_array($this->status, [self::STATUS_ACTIVE, self::STATUS_TRIALING]);
    }

    public function isTrialing(): bool
    {
        return $this->status === self::STATUS_TRIALING;
    }

    public function isCanceled(): bool
    {
        return $this->status === self::STATUS_CANCELED || $this->cancelAtPeriodEnd;
    }

    public function isPastDue(): bool
    {
        return $this->status === self::STATUS_PAST_DUE;
    }

    #[Groups(['subscription:read'])]
    public function getDaysUntilRenewal(): ?int
    {
        if (!$this->currentPeriodEnd) {
            return null;
        }

        $now = new \DateTime();
        $diff = $now->diff($this->currentPeriodEnd);

        return $diff->invert ? 0 : $diff->days;
    }
}
