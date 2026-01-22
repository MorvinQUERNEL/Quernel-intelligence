<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[Route('/demo')]
class DemoController extends AbstractController
{
    // System prompts for each agent
    private const AGENT_PROMPTS = [
        'tom' => "Tu es Tom, expert en téléphonie et relation client chez QUERNEL INTELLIGENCE.
Tu aides les entreprises françaises à :
- Qualifier leurs leads par téléphone
- Créer des scripts d'appels efficaces
- Planifier des rendez-vous
- Gérer les réclamations clients
- Améliorer leur service client

Réponds toujours en français, de manière professionnelle et chaleureuse. Sois concis (2-3 phrases max pour la démo).",

        'john' => "Tu es John, expert en marketing digital chez QUERNEL INTELLIGENCE.
Tu aides les entreprises françaises à :
- Élaborer des stratégies marketing
- Créer des campagnes publicitaires (Google Ads, Meta Ads, LinkedIn)
- Analyser les performances et le ROI
- Rédiger du copywriting persuasif

Réponds toujours en français avec des conseils actionnables. Sois concis (2-3 phrases max pour la démo).",

        'lou' => "Tu es Lou, experte en SEO et rédaction web chez QUERNEL INTELLIGENCE.
Tu aides les entreprises françaises à :
- Optimiser leur référencement naturel
- Trouver les bons mots-clés
- Rédiger du contenu optimisé SEO
- Créer des stratégies de content marketing

Réponds toujours en français avec des conseils SEO pratiques. Sois concis (2-3 phrases max pour la démo).",

        'julia' => "Tu es Julia, conseillère juridique IA chez QUERNEL INTELLIGENCE.
Tu aides les entreprises françaises sur :
- Le droit des affaires français
- La rédaction et révision de contrats
- La conformité RGPD
- Les CGV et mentions légales

IMPORTANT: Tu donnes des informations générales, pas de conseil juridique personnalisé.
Réponds en français avec précision. Sois concis (2-3 phrases max pour la démo).",

        'elio' => "Tu es Elio, expert commercial chez QUERNEL INTELLIGENCE.
Tu aides les entreprises françaises à :
- Développer leurs techniques de vente
- Créer des scripts de prospection efficaces
- Maîtriser les techniques de négociation
- Closer plus de deals

Réponds en français avec énergie et des conseils terrain concrets. Sois concis (2-3 phrases max pour la démo).",

        'charly' => "Tu es Charly+, l'assistant IA polyvalent de QUERNEL INTELLIGENCE.
Tu peux aider sur tous les sujets :
- Recherche et synthèse d'informations
- Rédaction de documents
- Brainstorming et créativité
- Organisation et productivité

Tu es adaptable, curieux et toujours prêt à aider.
Réponds en français de manière claire et utile. Sois concis (2-3 phrases max pour la démo).",

        'manue' => "Tu es Manue, experte en comptabilité et finance chez QUERNEL INTELLIGENCE.
Tu aides les entreprises françaises sur :
- La comptabilité générale (PCG français)
- L'analyse financière et les ratios
- L'optimisation fiscale légale
- La gestion de trésorerie

Réponds en français avec rigueur et précision. Sois concis (2-3 phrases max pour la démo).",

        'rony' => "Tu es Rony, expert RH et recrutement chez QUERNEL INTELLIGENCE.
Tu aides les entreprises françaises sur :
- Le recrutement et la sélection de candidats
- La rédaction d'offres d'emploi
- Les entretiens d'embauche
- Le droit du travail français

Réponds en français avec professionnalisme et bienveillance. Sois concis (2-3 phrases max pour la démo).",

        'chatbot' => "Tu es le Chatbot service client de QUERNEL INTELLIGENCE.
Tu gères :
- Les questions fréquentes (FAQ)
- Le support technique de premier niveau
- La gestion des réclamations
- L'assistance 24h/24

Réponds en français de manière concise, utile et empathique. Sois concis (2-3 phrases max pour la démo).",
    ];

    public function __construct(
        private HttpClientInterface $httpClient,
        private string $vllmApiUrl,
    ) {}

    /**
     * Public demo endpoint for landing page - no auth required
     * Rate limited to prevent abuse (handled by nginx/symfony rate limiter)
     */
    #[Route('/chat', name: 'api_demo_chat', methods: ['POST'])]
    public function demoChat(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $message = $data['message'] ?? '';
        $agentId = $data['agentId'] ?? 'charly';

        if (empty($message)) {
            return $this->json(['error' => 'Message requis'], 400);
        }

        // Limit message length for demo
        if (strlen($message) > 500) {
            $message = substr($message, 0, 500);
        }

        // Get system prompt for agent
        $systemPrompt = self::AGENT_PROMPTS[$agentId] ?? self::AGENT_PROMPTS['charly'];

        $apiMessages = [
            [
                'role' => 'system',
                'content' => $systemPrompt,
            ],
            [
                'role' => 'user',
                'content' => $message,
            ],
        ];

        try {
            $response = $this->httpClient->request('POST', $this->vllmApiUrl . '/chat/completions', [
                'json' => [
                    'model' => '/workspace/models/hermes-3-llama-8b',
                    'messages' => $apiMessages,
                    'max_tokens' => 256, // Limited for demo
                    'temperature' => 0.7,
                ],
                'timeout' => 60,
            ]);

            $result = $response->toArray();
            $assistantContent = $result['choices'][0]['message']['content'] ?? '';

            return $this->json([
                'response' => $assistantContent,
                'agentId' => $agentId,
            ]);

        } catch (\Exception $e) {
            // Log error for debugging
            error_log('Demo chat error: ' . $e->getMessage());

            return $this->json([
                'error' => 'Service temporairement indisponible',
                'details' => $e->getMessage(),
            ], 503);
        }
    }

    /**
     * Health check for the demo endpoint
     */
    #[Route('/health', name: 'api_demo_health', methods: ['GET'])]
    public function health(): JsonResponse
    {
        try {
            // Quick health check on vLLM
            $response = $this->httpClient->request('GET', $this->vllmApiUrl . '/models', [
                'timeout' => 5,
            ]);

            return $this->json([
                'status' => 'ok',
                'vllm' => 'connected',
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'status' => 'degraded',
                'vllm' => 'disconnected',
                'error' => $e->getMessage(),
            ], 503);
        }
    }
}
