<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;
use App\Entity\Subscription;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    operations: [
        new Get(security: "is_granted('ROLE_USER') and object == user"),
        new GetCollection(security: "is_granted('ROLE_ADMIN')"),
        new Post(
            denormalizationContext: ['groups' => ['user:create']],
            validationContext: ['groups' => ['Default', 'user:create']]
        ),
        new Patch(security: "is_granted('ROLE_USER') and object == user"),
        new Delete(security: "is_granted('ROLE_ADMIN')"),
    ],
    normalizationContext: ['groups' => ['user:read']],
    denormalizationContext: ['groups' => ['user:write']],
)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    #[Groups(['user:read'])]
    private ?Uuid $id = null;

    #[ORM\Column(length: 180, unique: true)]
    #[Assert\NotBlank]
    #[Assert\Email]
    #[Groups(['user:read', 'user:write', 'user:create'])]
    private ?string $email = null;

    #[ORM\Column]
    private array $roles = [];

    #[ORM\Column]
    private ?string $password = null;

    #[Assert\NotBlank(groups: ['user:create'])]
    #[Assert\Length(min: 8, groups: ['user:create'])]
    #[Groups(['user:create', 'user:write'])]
    private ?string $plainPassword = null;

    #[ORM\Column(length: 100, nullable: true)]
    #[Groups(['user:read', 'user:write', 'user:create'])]
    private ?string $firstName = null;

    #[ORM\Column(length: 100, nullable: true)]
    #[Groups(['user:read', 'user:write', 'user:create'])]
    private ?string $lastName = null;

    #[ORM\Column(length: 500, nullable: true)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $avatarUrl = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['user:read'])]
    private ?\DateTimeInterface $emailVerifiedAt = null;

    #[ORM\Column]
    #[Groups(['user:read'])]
    private bool $isActive = true;

    #[ORM\ManyToOne(inversedBy: 'users')]
    #[Groups(['user:read'])]
    private ?Plan $plan = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $planStartedAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $planExpiresAt = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $stripeCustomerId = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $googleId = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $appleId = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['user:read'])]
    private ?string $authProvider = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['user:read'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $lastLoginAt = null;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Conversation::class, orphanRemoval: true)]
    private Collection $conversations;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Agent::class, orphanRemoval: true)]
    private Collection $agents;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: ApiKey::class, orphanRemoval: true)]
    private Collection $apiKeys;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Subscription::class)]
    private Collection $subscriptions;

    public function __construct()
    {
        $this->conversations = new ArrayCollection();
        $this->agents = new ArrayCollection();
        $this->apiKeys = new ArrayCollection();
        $this->subscriptions = new ArrayCollection();
        $this->createdAt = new \DateTime();
        $this->updatedAt = new \DateTime();
    }

    public function getId(): ?Uuid
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;
        return $this;
    }

    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';
        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;
        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;
        return $this;
    }

    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }

    public function setPlainPassword(?string $plainPassword): static
    {
        $this->plainPassword = $plainPassword;
        return $this;
    }

    public function eraseCredentials(): void
    {
        $this->plainPassword = null;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(?string $firstName): static
    {
        $this->firstName = $firstName;
        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(?string $lastName): static
    {
        $this->lastName = $lastName;
        return $this;
    }

    #[Groups(['user:read'])]
    public function getFullName(): string
    {
        return trim($this->firstName . ' ' . $this->lastName);
    }

    public function getAvatarUrl(): ?string
    {
        return $this->avatarUrl;
    }

    public function setAvatarUrl(?string $avatarUrl): static
    {
        $this->avatarUrl = $avatarUrl;
        return $this;
    }

    public function getEmailVerifiedAt(): ?\DateTimeInterface
    {
        return $this->emailVerifiedAt;
    }

    public function setEmailVerifiedAt(?\DateTimeInterface $emailVerifiedAt): static
    {
        $this->emailVerifiedAt = $emailVerifiedAt;
        return $this;
    }

    public function isActive(): bool
    {
        return $this->isActive;
    }

    public function setIsActive(bool $isActive): static
    {
        $this->isActive = $isActive;
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

    #[Groups(['user:read'])]
    public function getPlanName(): ?string
    {
        return $this->plan?->getSlug() ?? 'free';
    }

    public function getPlanStartedAt(): ?\DateTimeInterface
    {
        return $this->planStartedAt;
    }

    public function setPlanStartedAt(?\DateTimeInterface $planStartedAt): static
    {
        $this->planStartedAt = $planStartedAt;
        return $this;
    }

    public function getPlanExpiresAt(): ?\DateTimeInterface
    {
        return $this->planExpiresAt;
    }

    public function setPlanExpiresAt(?\DateTimeInterface $planExpiresAt): static
    {
        $this->planExpiresAt = $planExpiresAt;
        return $this;
    }

    public function getStripeCustomerId(): ?string
    {
        return $this->stripeCustomerId;
    }

    public function setStripeCustomerId(?string $stripeCustomerId): static
    {
        $this->stripeCustomerId = $stripeCustomerId;
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

    public function getLastLoginAt(): ?\DateTimeInterface
    {
        return $this->lastLoginAt;
    }

    public function setLastLoginAt(?\DateTimeInterface $lastLoginAt): static
    {
        $this->lastLoginAt = $lastLoginAt;
        return $this;
    }

    #[ORM\PreUpdate]
    public function preUpdate(): void
    {
        $this->updatedAt = new \DateTime();
    }

    /**
     * @return Collection<int, Conversation>
     */
    public function getConversations(): Collection
    {
        return $this->conversations;
    }

    public function addConversation(Conversation $conversation): static
    {
        if (!$this->conversations->contains($conversation)) {
            $this->conversations->add($conversation);
            $conversation->setUser($this);
        }
        return $this;
    }

    public function removeConversation(Conversation $conversation): static
    {
        if ($this->conversations->removeElement($conversation)) {
            if ($conversation->getUser() === $this) {
                $conversation->setUser(null);
            }
        }
        return $this;
    }

    /**
     * @return Collection<int, Agent>
     */
    public function getAgents(): Collection
    {
        return $this->agents;
    }

    /**
     * @return Collection<int, ApiKey>
     */
    public function getApiKeys(): Collection
    {
        return $this->apiKeys;
    }

    public function getGoogleId(): ?string
    {
        return $this->googleId;
    }

    public function setGoogleId(?string $googleId): static
    {
        $this->googleId = $googleId;
        return $this;
    }

    public function getAppleId(): ?string
    {
        return $this->appleId;
    }

    public function setAppleId(?string $appleId): static
    {
        $this->appleId = $appleId;
        return $this;
    }

    public function getAuthProvider(): ?string
    {
        return $this->authProvider;
    }

    public function setAuthProvider(?string $authProvider): static
    {
        $this->authProvider = $authProvider;
        return $this;
    }

    /**
     * @return Collection<int, Subscription>
     */
    public function getSubscriptions(): Collection
    {
        return $this->subscriptions;
    }

    public function getActiveSubscription(): ?Subscription
    {
        foreach ($this->subscriptions as $subscription) {
            if ($subscription->isActive()) {
                return $subscription;
            }
        }
        return null;
    }
}
