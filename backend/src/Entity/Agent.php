<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use App\Repository\AgentRepository;
use App\State\PublicAgentsProvider;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: AgentRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    operations: [
        new GetCollection(
            uriTemplate: '/agents/public',
            provider: PublicAgentsProvider::class,
            normalizationContext: ['groups' => ['agent:read']],
            name: 'get_public_agents'
        ),
        new GetCollection(security: "is_granted('ROLE_USER')"),
        new Get(security: "is_granted('ROLE_USER') and (object.getUser() == user or object.isPublic())"),
        new Post(security: "is_granted('ROLE_USER')"),
        new Patch(security: "is_granted('ROLE_USER') and object.getUser() == user"),
        new Delete(security: "is_granted('ROLE_USER') and object.getUser() == user"),
    ],
    normalizationContext: ['groups' => ['agent:read']],
    denormalizationContext: ['groups' => ['agent:write']],
)]
#[ApiFilter(BooleanFilter::class, properties: ['isPublic'])]
class Agent
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    #[Groups(['agent:read', 'conversation:read'])]
    private ?Uuid $id = null;

    #[ORM\ManyToOne(inversedBy: 'agents')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank]
    #[Assert\Length(min: 2, max: 100)]
    #[Groups(['agent:read', 'agent:write', 'conversation:read'])]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['agent:read', 'agent:write'])]
    private ?string $description = null;

    #[ORM\Column(length: 500, nullable: true)]
    #[Groups(['agent:read', 'agent:write', 'conversation:read'])]
    private ?string $avatarUrl = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Assert\NotBlank]
    #[Groups(['agent:read', 'agent:write'])]
    private ?string $systemPrompt = null;

    #[ORM\Column(length: 100)]
    #[Groups(['agent:read', 'agent:write'])]
    private string $model = 'Qwen2.5-32B-Instruct-AWQ';

    #[ORM\Column(type: Types::DECIMAL, precision: 3, scale: 2)]
    #[Assert\Range(min: 0, max: 2)]
    #[Groups(['agent:read', 'agent:write'])]
    private string $temperature = '0.7';

    #[ORM\Column]
    #[Assert\Range(min: 1, max: 8192)]
    #[Groups(['agent:read', 'agent:write'])]
    private int $maxTokens = 2048;

    #[ORM\Column]
    #[Groups(['agent:read', 'agent:write'])]
    private bool $isPublic = false;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['agent:read'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['agent:read'])]
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

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;
        return $this;
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

    public function getSystemPrompt(): ?string
    {
        return $this->systemPrompt;
    }

    public function setSystemPrompt(string $systemPrompt): static
    {
        $this->systemPrompt = $systemPrompt;
        return $this;
    }

    public function getModel(): string
    {
        return $this->model;
    }

    public function setModel(string $model): static
    {
        $this->model = $model;
        return $this;
    }

    public function getTemperature(): string
    {
        return $this->temperature;
    }

    public function setTemperature(string $temperature): static
    {
        $this->temperature = $temperature;
        return $this;
    }

    public function getMaxTokens(): int
    {
        return $this->maxTokens;
    }

    public function setMaxTokens(int $maxTokens): static
    {
        $this->maxTokens = $maxTokens;
        return $this;
    }

    public function isPublic(): bool
    {
        return $this->isPublic;
    }

    public function setIsPublic(bool $isPublic): static
    {
        $this->isPublic = $isPublic;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    #[ORM\PreUpdate]
    public function preUpdate(): void
    {
        $this->updatedAt = new \DateTime();
    }
}
