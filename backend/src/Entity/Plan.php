<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Repository\PlanRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: PlanRepository::class)]
#[ApiResource(
    operations: [
        new Get(),
        new GetCollection(),
    ],
    normalizationContext: ['groups' => ['plan:read']],
)]
class Plan
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    #[Groups(['plan:read', 'user:read'])]
    private ?Uuid $id = null;

    #[ORM\Column(length: 100)]
    #[Groups(['plan:read', 'user:read'])]
    private ?string $name = null;

    #[ORM\Column(length: 50, unique: true)]
    #[Groups(['plan:read', 'user:read'])]
    private ?string $slug = null;

    #[ORM\Column]
    #[Groups(['plan:read'])]
    private int $monthlyTokens = 10000;

    #[ORM\Column]
    #[Groups(['plan:read'])]
    private int $maxAgents = 1;

    #[ORM\Column]
    #[Groups(['plan:read'])]
    private int $maxDocuments = 0;

    #[ORM\Column]
    #[Groups(['plan:read'])]
    private int $maxTeamMembers = 1;

    #[ORM\Column]
    #[Groups(['plan:read'])]
    private bool $hasApiAccess = false;

    #[ORM\Column]
    #[Groups(['plan:read'])]
    private bool $hasWorkflows = false;

    #[ORM\Column]
    #[Groups(['plan:read'])]
    private bool $hasPrioritySupport = false;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2, nullable: true)]
    #[Groups(['plan:read'])]
    private ?string $priceMonthly = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2, nullable: true)]
    #[Groups(['plan:read'])]
    private ?string $priceYearly = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $stripePriceIdMonthly = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $stripePriceIdYearly = null;

    #[ORM\Column]
    private bool $isActive = true;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\OneToMany(mappedBy: 'plan', targetEntity: User::class)]
    private Collection $users;

    public function __construct()
    {
        $this->users = new ArrayCollection();
        $this->createdAt = new \DateTime();
    }

    public function getId(): ?Uuid
    {
        return $this->id;
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

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): static
    {
        $this->slug = $slug;
        return $this;
    }

    public function getMonthlyTokens(): int
    {
        return $this->monthlyTokens;
    }

    public function setMonthlyTokens(int $monthlyTokens): static
    {
        $this->monthlyTokens = $monthlyTokens;
        return $this;
    }

    public function getMaxAgents(): int
    {
        return $this->maxAgents;
    }

    public function setMaxAgents(int $maxAgents): static
    {
        $this->maxAgents = $maxAgents;
        return $this;
    }

    public function getMaxDocuments(): int
    {
        return $this->maxDocuments;
    }

    public function setMaxDocuments(int $maxDocuments): static
    {
        $this->maxDocuments = $maxDocuments;
        return $this;
    }

    public function getMaxTeamMembers(): int
    {
        return $this->maxTeamMembers;
    }

    public function setMaxTeamMembers(int $maxTeamMembers): static
    {
        $this->maxTeamMembers = $maxTeamMembers;
        return $this;
    }

    public function hasApiAccess(): bool
    {
        return $this->hasApiAccess;
    }

    public function setHasApiAccess(bool $hasApiAccess): static
    {
        $this->hasApiAccess = $hasApiAccess;
        return $this;
    }

    public function hasWorkflows(): bool
    {
        return $this->hasWorkflows;
    }

    public function setHasWorkflows(bool $hasWorkflows): static
    {
        $this->hasWorkflows = $hasWorkflows;
        return $this;
    }

    public function hasPrioritySupport(): bool
    {
        return $this->hasPrioritySupport;
    }

    public function setHasPrioritySupport(bool $hasPrioritySupport): static
    {
        $this->hasPrioritySupport = $hasPrioritySupport;
        return $this;
    }

    public function getPriceMonthly(): ?string
    {
        return $this->priceMonthly;
    }

    public function setPriceMonthly(?string $priceMonthly): static
    {
        $this->priceMonthly = $priceMonthly;
        return $this;
    }

    public function getPriceYearly(): ?string
    {
        return $this->priceYearly;
    }

    public function setPriceYearly(?string $priceYearly): static
    {
        $this->priceYearly = $priceYearly;
        return $this;
    }

    public function getStripePriceIdMonthly(): ?string
    {
        return $this->stripePriceIdMonthly;
    }

    public function setStripePriceIdMonthly(?string $stripePriceIdMonthly): static
    {
        $this->stripePriceIdMonthly = $stripePriceIdMonthly;
        return $this;
    }

    public function getStripePriceIdYearly(): ?string
    {
        return $this->stripePriceIdYearly;
    }

    public function setStripePriceIdYearly(?string $stripePriceIdYearly): static
    {
        $this->stripePriceIdYearly = $stripePriceIdYearly;
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

    /**
     * @return Collection<int, User>
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }
}
