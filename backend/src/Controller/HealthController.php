<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Controller for health check endpoint.
 */
#[Route('/api')]
final class HealthController extends AbstractController
{
    #[Route('/health', name: 'api_health', methods: ['GET'])]
    public function health(): JsonResponse
    {
        return new JsonResponse([
            'status' => 'ok',
            'timestamp' => (new \DateTimeImmutable())->format(\DateTimeInterface::RFC3339),
            'service' => 'quernel-intelligence-api',
            'version' => '1.0.0',
        ]);
    }
}
