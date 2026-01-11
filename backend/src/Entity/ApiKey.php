<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Delete;
use App\Repository\ApiKeyRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ApiKeyRepository::class)]
#[ApiResource(
    operations: [
        new Get(security: "is_granted('ROLE_USER') and object.getUser() == user"),
        new GetCollection(security: "is_granted('ROLE_USER')"),
        new Post(security: "is_granted('ROLE_USER')"),
        new Delete(security: "is_granted('ROLE_USER') and object.getUser() == user"),
    ],
    normalizationContext: ['groups' => ['apikey:read']],
    denormalizationContext: ['groups' => ['apikey:write']],
)]
class ApiKey
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    #[Groups(['apikey:read'])]
    private ?Uuid $id = null;

    #[ORM\ManyToOne(inversedBy: 'apiKeys')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank]
    #[Groups(['apikey:read', 'apikey:write'])]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $keyHash = null;

    #[ORM\Column(length: 12)]
    #[Groups(['apikey:read'])]
    private ?string $keyPrefix = null;

    #[ORM\Column(type: Types::SIMPLE_ARRAY, nullable: true)]
    #[Groups(['apikey:read', 'apikey:write'])]
    private ?array $scopes = ['chat'];

    #[ORM\Column]
    #[Groups(['apikey:read', 'apikey:write'])]
    private int $rateLimitPerMinute = 60;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['apikey:read'])]
    private ?\DateTimeInterface $lastUsedAt = null;

    #[ORM\Column]
    #[Groups(['apikey:read'])]
    private int $totalRequests = 0;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['apikey:read', 'apikey:write'])]
    private ?\DateTimeInterface $expiresAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['apikey:read'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $revokedAt = null;

    // Transient property - only set when creating
    #[Groups(['apikey:read'])]
    private ?string $plainKey = null;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
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

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;
        return $this;
    }

    public function getKeyHash(): ?string
    {
        return $this->keyHash;
    }

    public function setKeyHash(string $keyHash): static
    {
        $this->keyHash = $keyHash;
        return $this;
    }

    public function getKeyPrefix(): ?string
    {
        return $this->keyPrefix;
    }

    public function setKeyPrefix(string $keyPrefix): static
    {
        $this->keyPrefix = $keyPrefix;
        return $this;
    }

    public function getScopes(): ?array
    {
        return $this->scopes;
    }

    public function setScopes(?array $scopes): static
    {
        $this->scopes = $scopes;
        return $this;
    }

    public function getRateLimitPerMinute(): int
    {
        return $this->rateLimitPerMinute;
    }

    public function setRateLimitPerMinute(int $rateLimitPerMinute): static
    {
        $this->rateLimitPerMinute = $rateLimitPerMinute;
        return $this;
    }

    public function getLastUsedAt(): ?\DateTimeInterface
    {
        return $this->lastUsedAt;
    }

    public function setLastUsedAt(?\DateTimeInterface $lastUsedAt): static
    {
        $this->lastUsedAt = $lastUsedAt;
        return $this;
    }

    public function getTotalRequests(): int
    {
        return $this->totalRequests;
    }

    public function incrementTotalRequests(): static
    {
        $this->totalRequests++;
        $this->lastUsedAt = new \DateTime();
        return $this;
    }

    public function getExpiresAt(): ?\DateTimeInterface
    {
        return $this->expiresAt;
    }

    public function setExpiresAt(?\DateTimeInterface $expiresAt): static
    {
        $this->expiresAt = $expiresAt;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function getRevokedAt(): ?\DateTimeInterface
    {
        return $this->revokedAt;
    }

    public function revoke(): static
    {
        $this->revokedAt = new \DateTime();
        return $this;
    }

    public function isRevoked(): bool
    {
        return $this->revokedAt !== null;
    }

    public function isExpired(): bool
    {
        return $this->expiresAt !== null && $this->expiresAt < new \DateTime();
    }

    public function isValid(): bool
    {
        return !$this->isRevoked() && !$this->isExpired();
    }

    public function getPlainKey(): ?string
    {
        return $this->plainKey;
    }

    public function setPlainKey(?string $plainKey): static
    {
        $this->plainKey = $plainKey;
        return $this;
    }

    /**
     * Generate a new API key
     */
    public static function generateKey(): string
    {
        return 'qk_' . bin2hex(random_bytes(32));
    }
}
