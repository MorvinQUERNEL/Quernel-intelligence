<?php

namespace App\Controller;

use App\Entity\Conversation;
use App\Entity\Message;
use App\Entity\User;
use App\Repository\AgentRepository;
use App\Repository\ConversationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[Route('/api/chat')]
class ChatController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private HttpClientInterface $httpClient,
        private ConversationRepository $conversationRepository,
        private AgentRepository $agentRepository,
        private string $vllmApiUrl,
    ) {}

    #[Route('/conversations', name: 'api_conversations', methods: ['GET'])]
    public function listConversations(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        $conversations = $this->conversationRepository->findByUser($user);

        return $this->json(array_map(function (Conversation $conv) {
            return [
                'id' => $conv->getId(),
                'title' => $conv->getTitle(),
                'totalTokens' => $conv->getTotalTokens(),
                'messageCount' => $conv->getMessageCount(),
                'createdAt' => $conv->getCreatedAt()->format('c'),
                'updatedAt' => $conv->getUpdatedAt()->format('c'),
            ];
        }, $conversations));
    }

    #[Route('/conversations', name: 'api_create_conversation', methods: ['POST'])]
    public function createConversation(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        $data = json_decode($request->getContent(), true);

        $conversation = new Conversation();
        $conversation->setUser($user);
        $conversation->setTitle($data['title'] ?? 'Nouvelle conversation');

        if (isset($data['agentId'])) {
            $agent = $this->agentRepository->find($data['agentId']);
            if ($agent) {
                $conversation->setAgent($agent);
            }
        }

        $this->em->persist($conversation);
        $this->em->flush();

        return $this->json([
            'id' => $conversation->getId(),
            'title' => $conversation->getTitle(),
        ], 201);
    }

    #[Route('/conversations/{id}', name: 'api_get_conversation', methods: ['GET'])]
    public function getConversation(Conversation $conversation): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        if ($conversation->getUser() !== $user) {
            return $this->json(['error' => 'Acces refuse'], 403);
        }

        $messages = $conversation->getMessages()->toArray();

        return $this->json([
            'id' => $conversation->getId(),
            'title' => $conversation->getTitle(),
            'agent' => $conversation->getAgent() ? [
                'id' => $conversation->getAgent()->getId(),
                'name' => $conversation->getAgent()->getName(),
            ] : null,
            'messages' => array_map(function (Message $msg) {
                return [
                    'id' => $msg->getId(),
                    'role' => $msg->getRole(),
                    'content' => $msg->getContent(),
                    'tokensUsed' => $msg->getTotalTokens(),
                    'createdAt' => $msg->getCreatedAt()->format('c'),
                ];
            }, $messages),
            'totalTokens' => $conversation->getTotalTokens(),
            'createdAt' => $conversation->getCreatedAt()->format('c'),
            'updatedAt' => $conversation->getUpdatedAt()->format('c'),
        ]);
    }

    #[Route('/conversations/{id}/messages', name: 'api_send_message', methods: ['POST'])]
    public function sendMessage(Conversation $conversation, Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        if ($conversation->getUser() !== $user) {
            return $this->json(['error' => 'Acces refuse'], 403);
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['content']) || empty($data['content'])) {
            return $this->json(['error' => 'Le message ne peut pas etre vide'], 400);
        }

        // Check token limit
        $tokensThisMonth = $this->conversationRepository->countTokensThisMonth($user);
        $tokenLimit = $user->getPlan()->getMonthlyTokens();

        if ($tokenLimit > 0 && $tokensThisMonth >= $tokenLimit) {
            return $this->json([
                'error' => 'Limite de tokens atteinte pour ce mois',
                'tokensUsed' => $tokensThisMonth,
                'tokenLimit' => $tokenLimit,
            ], 429);
        }

        // Save user message
        $userMessage = new Message();
        $userMessage->setConversation($conversation);
        $userMessage->setRole('user');
        $userMessage->setContent($data['content']);
        $this->em->persist($userMessage);

        // Build messages for API
        $apiMessages = [];

        // Add system prompt if agent is set
        $agent = $conversation->getAgent();
        if ($agent && $agent->getSystemPrompt()) {
            $apiMessages[] = [
                'role' => 'system',
                'content' => $agent->getSystemPrompt(),
            ];
        }

        // Add conversation history
        foreach ($conversation->getMessages() as $msg) {
            $apiMessages[] = [
                'role' => $msg->getRole(),
                'content' => $msg->getContent(),
            ];
        }

        // Add the new user message
        $apiMessages[] = [
            'role' => 'user',
            'content' => $data['content'],
        ];

        // Get model from agent or use default
        $model = $agent ? $agent->getModel() : 'Qwen/Qwen2.5-32B-Instruct-AWQ';

        // Call vLLM API
        try {
            $response = $this->httpClient->request('POST', $this->vllmApiUrl . '/chat/completions', [
                'json' => [
                    'model' => $model,
                    'messages' => $apiMessages,
                    'max_tokens' => 2048,
                    'temperature' => 0.7,
                ],
                'timeout' => 120,
            ]);

            $result = $response->toArray();

            $assistantContent = $result['choices'][0]['message']['content'] ?? '';
            $promptTokens = $result['usage']['prompt_tokens'] ?? 0;
            $completionTokens = $result['usage']['completion_tokens'] ?? 0;
            $totalTokens = $promptTokens + $completionTokens;

            // Save assistant message
            $assistantMessage = new Message();
            $assistantMessage->setConversation($conversation);
            $assistantMessage->setRole('assistant');
            $assistantMessage->setContent($assistantContent);
            $assistantMessage->setPromptTokens($promptTokens);
            $assistantMessage->setCompletionTokens($completionTokens);
            $this->em->persist($assistantMessage);

            // Update conversation
            $conversation->addTokens($totalTokens);
            $conversation->setUpdatedAt(new \DateTime());

            // Update title if first message
            if ($conversation->getMessageCount() <= 1) {
                $title = substr($data['content'], 0, 50);
                if (strlen($data['content']) > 50) {
                    $title .= '...';
                }
                $conversation->setTitle($title);
            }

            $this->em->flush();

            return $this->json([
                'userMessage' => [
                    'id' => $userMessage->getId(),
                    'role' => 'user',
                    'content' => $data['content'],
                ],
                'assistantMessage' => [
                    'id' => $assistantMessage->getId(),
                    'role' => 'assistant',
                    'content' => $assistantContent,
                    'tokensUsed' => $totalTokens,
                ],
                'conversation' => [
                    'totalTokens' => $conversation->getTotalTokens(),
                    'title' => $conversation->getTitle(),
                ],
            ]);

        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Erreur lors de la communication avec l\'IA',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    #[Route('/conversations/{id}/stream', name: 'api_stream_message', methods: ['POST'])]
    public function streamMessage(Conversation $conversation, Request $request): StreamedResponse|JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        if ($conversation->getUser() !== $user) {
            return $this->json(['error' => 'Acces refuse'], 403);
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['content']) || empty($data['content'])) {
            return $this->json(['error' => 'Le message ne peut pas etre vide'], 400);
        }

        // Check token limit
        $tokensThisMonth = $this->conversationRepository->countTokensThisMonth($user);
        $tokenLimit = $user->getPlan()->getMonthlyTokens();

        if ($tokenLimit > 0 && $tokensThisMonth >= $tokenLimit) {
            return $this->json([
                'error' => 'Limite de tokens atteinte pour ce mois',
                'tokensUsed' => $tokensThisMonth,
                'tokenLimit' => $tokenLimit,
            ], 429);
        }

        // Save user message
        $userMessage = new Message();
        $userMessage->setConversation($conversation);
        $userMessage->setRole('user');
        $userMessage->setContent($data['content']);
        $this->em->persist($userMessage);
        $this->em->flush();

        // Build messages for API
        $apiMessages = [];

        // Add system prompt if agent is set
        $agent = $conversation->getAgent();
        if ($agent && $agent->getSystemPrompt()) {
            $apiMessages[] = [
                'role' => 'system',
                'content' => $agent->getSystemPrompt(),
            ];
        } else {
            // Default system prompt
            $apiMessages[] = [
                'role' => 'system',
                'content' => "Tu es QUERNEL IA, un assistant intelligent développé par QUERNEL INTELLIGENCE, une entreprise française. Tu es professionnel, précis et utile. Tu réponds en français par défaut.",
            ];
        }

        // Add conversation history (excluding the just-added message)
        foreach ($conversation->getMessages() as $msg) {
            if ($msg->getId() !== $userMessage->getId()) {
                $apiMessages[] = [
                    'role' => $msg->getRole(),
                    'content' => $msg->getContent(),
                ];
            }
        }

        // Add the new user message
        $apiMessages[] = [
            'role' => 'user',
            'content' => $data['content'],
        ];

        // Get model from agent or use default
        $model = $agent ? $agent->getModel() : '/workspace/models/Qwen2.5-32B-Instruct-AWQ';

        $vllmUrl = $this->vllmApiUrl;
        $httpClient = $this->httpClient;
        $em = $this->em;
        $conv = $conversation;
        $userMsg = $userMessage;
        $messageContent = $data['content'];

        $response = new StreamedResponse(function () use ($apiMessages, $model, $vllmUrl, $httpClient, $em, $conv, $userMsg, $messageContent) {
            $fullContent = '';
            $promptTokens = 0;
            $completionTokens = 0;

            try {
                $response = $httpClient->request('POST', $vllmUrl . '/chat/completions', [
                    'json' => [
                        'model' => $model,
                        'messages' => $apiMessages,
                        'max_tokens' => 2048,
                        'temperature' => 0.7,
                        'stream' => true,
                    ],
                    'timeout' => 120,
                    'buffer' => false,
                ]);

                foreach ($httpClient->stream($response) as $chunk) {
                    $content = $chunk->getContent();
                    $lines = explode("\n", $content);

                    foreach ($lines as $line) {
                        if (str_starts_with($line, 'data: ')) {
                            $jsonData = substr($line, 6);
                            if ($jsonData === '[DONE]') {
                                continue;
                            }

                            $decoded = json_decode($jsonData, true);
                            if ($decoded && isset($decoded['choices'][0]['delta']['content'])) {
                                $text = $decoded['choices'][0]['delta']['content'];
                                $fullContent .= $text;
                                echo "data: " . json_encode(['content' => $text]) . "\n\n";
                                ob_flush();
                                flush();
                            }

                            // Capture token usage from final chunk
                            if ($decoded && isset($decoded['usage'])) {
                                $promptTokens = $decoded['usage']['prompt_tokens'] ?? 0;
                                $completionTokens = $decoded['usage']['completion_tokens'] ?? 0;
                            }
                        }
                    }
                }

                // Estimate tokens if not provided
                if ($completionTokens === 0) {
                    $completionTokens = (int) (strlen($fullContent) / 4);
                    $promptTokens = (int) (strlen(json_encode($apiMessages)) / 4);
                }

                $totalTokens = $promptTokens + $completionTokens;

                // Save assistant message
                $assistantMessage = new Message();
                $assistantMessage->setConversation($conv);
                $assistantMessage->setRole('assistant');
                $assistantMessage->setContent($fullContent);
                $assistantMessage->setPromptTokens($promptTokens);
                $assistantMessage->setCompletionTokens($completionTokens);
                $em->persist($assistantMessage);

                // Update conversation
                $conv->addTokens($totalTokens);
                $conv->setUpdatedAt(new \DateTime());

                // Update title if first message
                if ($conv->getMessageCount() <= 2) {
                    $title = substr($messageContent, 0, 50);
                    if (strlen($messageContent) > 50) {
                        $title .= '...';
                    }
                    $conv->setTitle($title);
                }

                $em->flush();

                // Send final event with metadata
                echo "data: " . json_encode([
                    'done' => true,
                    'assistantMessageId' => $assistantMessage->getId(),
                    'tokensUsed' => $totalTokens,
                    'conversationTitle' => $conv->getTitle(),
                ]) . "\n\n";
                ob_flush();
                flush();

            } catch (\Exception $e) {
                echo "data: " . json_encode(['error' => $e->getMessage()]) . "\n\n";
                ob_flush();
                flush();
            }
        });

        $response->headers->set('Content-Type', 'text/event-stream');
        $response->headers->set('Cache-Control', 'no-cache');
        $response->headers->set('Connection', 'keep-alive');
        $response->headers->set('X-Accel-Buffering', 'no');

        return $response;
    }

    #[Route('/conversations/{id}', name: 'api_delete_conversation', methods: ['DELETE'])]
    public function deleteConversation(Conversation $conversation): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        if ($conversation->getUser() !== $user) {
            return $this->json(['error' => 'Acces refuse'], 403);
        }

        $conversation->setArchivedAt(new \DateTime());
        $this->em->flush();

        return $this->json(['message' => 'Conversation archivee']);
    }
}
