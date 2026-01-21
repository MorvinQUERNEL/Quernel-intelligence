<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Repository\AgentRepository;

class PublicAgentsProvider implements ProviderInterface
{
    public function __construct(
        private readonly AgentRepository $agentRepository,
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        return $this->agentRepository->findBy(['isPublic' => true]);
    }
}
