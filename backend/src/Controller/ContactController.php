<?php

declare(strict_types=1);

namespace App\Controller;

use App\DTO\ContactDTO;
use App\Service\MailerService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\RateLimiter\RateLimiterFactory;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * Controller for handling contact form submissions.
 */
#[Route('/api')]
final class ContactController extends AbstractController
{
    public function __construct(
        private readonly ValidatorInterface $validator,
        private readonly MailerService $mailerService,
        private readonly RateLimiterFactory $contactApiLimiter,
    ) {
    }

    #[Route('/contact', name: 'api_contact', methods: ['POST'])]
    public function contact(Request $request): JsonResponse
    {
        // Rate limiting by IP
        $limiter = $this->contactApiLimiter->create($request->getClientIp() ?? 'unknown');
        $limit = $limiter->consume();

        if (!$limit->isAccepted()) {
            return new JsonResponse(
                [
                    'success' => false,
                    'message' => 'Trop de requêtes. Veuillez réessayer dans quelques minutes.',
                    'errors' => [],
                ],
                Response::HTTP_TOO_MANY_REQUESTS,
                [
                    'X-RateLimit-Remaining' => $limit->getRemainingTokens(),
                    'X-RateLimit-Retry-After' => $limit->getRetryAfter()->getTimestamp() - time(),
                ]
            );
        }

        // Validate Content-Type
        $contentType = $request->headers->get('Content-Type');
        if (!str_contains($contentType ?? '', 'application/json')) {
            return new JsonResponse(
                [
                    'success' => false,
                    'message' => 'Le Content-Type doit être application/json.',
                    'errors' => [],
                ],
                Response::HTTP_UNSUPPORTED_MEDIA_TYPE
            );
        }

        // Parse JSON body
        try {
            /** @var array<string, mixed> $data */
            $data = json_decode($request->getContent(), true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            return new JsonResponse(
                [
                    'success' => false,
                    'message' => 'Le format JSON est invalide.',
                    'errors' => [],
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        // Create and validate DTO
        $contactDTO = ContactDTO::fromArray($data);
        $violations = $this->validator->validate($contactDTO);

        if (count($violations) > 0) {
            $errors = [];
            foreach ($violations as $violation) {
                $field = $violation->getPropertyPath();
                $errors[$field] = $violation->getMessage();
            }

            return new JsonResponse(
                [
                    'success' => false,
                    'message' => 'Veuillez corriger les erreurs du formulaire.',
                    'errors' => $errors,
                ],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        // Send email notification
        try {
            $this->mailerService->sendContactNotification($contactDTO);
        } catch (\Throwable $e) {
            // Log the error but don't expose details to the client
            // In production, you would log this: $this->logger->error($e->getMessage());

            return new JsonResponse(
                [
                    'success' => false,
                    'message' => 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer ultérieurement.',
                    'errors' => [],
                ],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }

        return new JsonResponse(
            [
                'success' => true,
                'message' => 'Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.',
                'errors' => [],
            ],
            Response::HTTP_OK
        );
    }
}
