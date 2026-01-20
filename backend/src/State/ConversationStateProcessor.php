<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Conversation;
use Symfony\Bundle\SecurityBundle\Security;

final class ConversationStateProcessor implements ProcessorInterface
{
    public function __construct(
        private ProcessorInterface $persistProcessor,
        private Security $security,
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if ($data instanceof Conversation && $data->getUser() === null) {
            $user = $this->security->getUser();
            if ($user) {
                $data->setUser($user);
            }
        }

        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
