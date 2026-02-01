<?php

declare(strict_types=1);

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

/**
 * Data Transfer Object for contact form submissions.
 */
final class ContactDTO
{
    public function __construct(
        #[Assert\NotBlank(message: 'Le nom est obligatoire.')]
        #[Assert\Length(
            min: 2,
            max: 100,
            minMessage: 'Le nom doit contenir au moins {{ limit }} caractères.',
            maxMessage: 'Le nom ne peut pas dépasser {{ limit }} caractères.'
        )]
        public readonly string $name,

        #[Assert\NotBlank(message: "L'adresse email est obligatoire.")]
        #[Assert\Email(message: "L'adresse email '{{ value }}' n'est pas valide.")]
        public readonly string $email,

        #[Assert\NotBlank(message: 'Le numéro de téléphone est obligatoire.')]
        #[Assert\Regex(
            pattern: '/^[\d\s\+\-\.\(\)]{10,20}$/',
            message: 'Le numéro de téléphone n\'est pas valide.'
        )]
        public readonly string $phone,

        #[Assert\NotBlank(message: 'Le type de projet est obligatoire.')]
        #[Assert\Choice(
            choices: ['site-vitrine', 'e-commerce', 'application-web', 'ia-solution', 'autre'],
            message: 'Le type de projet sélectionné n\'est pas valide.'
        )]
        public readonly string $projectType,

        #[Assert\NotBlank(message: 'Le budget est obligatoire.')]
        #[Assert\Choice(
            choices: ['moins-3000', '3000-5000', '5000-10000', '10000-20000', 'plus-20000'],
            message: 'Le budget sélectionné n\'est pas valide.'
        )]
        public readonly string $budget,

        #[Assert\NotBlank(message: 'Le message est obligatoire.')]
        #[Assert\Length(
            min: 10,
            max: 5000,
            minMessage: 'Le message doit contenir au moins {{ limit }} caractères.',
            maxMessage: 'Le message ne peut pas dépasser {{ limit }} caractères.'
        )]
        public readonly string $message,
    ) {
    }

    /**
     * Create a ContactDTO from an array of data.
     *
     * @param array<string, mixed> $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            name: (string) ($data['name'] ?? ''),
            email: (string) ($data['email'] ?? ''),
            phone: (string) ($data['phone'] ?? ''),
            projectType: (string) ($data['projectType'] ?? ''),
            budget: (string) ($data['budget'] ?? ''),
            message: (string) ($data['message'] ?? ''),
        );
    }

    /**
     * Get a human-readable project type label.
     */
    public function getProjectTypeLabel(): string
    {
        return match ($this->projectType) {
            'site-vitrine' => 'Site vitrine',
            'e-commerce' => 'E-commerce',
            'application-web' => 'Application web',
            'ia-solution' => 'Solution IA',
            'autre' => 'Autre',
            default => $this->projectType,
        };
    }

    /**
     * Get a human-readable budget label.
     */
    public function getBudgetLabel(): string
    {
        return match ($this->budget) {
            'moins-3000' => 'Moins de 3 000 €',
            '3000-5000' => '3 000 € - 5 000 €',
            '5000-10000' => '5 000 € - 10 000 €',
            '10000-20000' => '10 000 € - 20 000 €',
            'plus-20000' => 'Plus de 20 000 €',
            default => $this->budget,
        };
    }
}
