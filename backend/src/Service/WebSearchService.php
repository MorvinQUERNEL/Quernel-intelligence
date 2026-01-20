<?php

namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class WebSearchService
{
    public function __construct(
        private HttpClientInterface $httpClient,
    ) {}

    /**
     * Search the web using DuckDuckGo Instant Answer API
     */
    public function search(string $query, int $maxResults = 5): array
    {
        try {
            // Use DuckDuckGo Instant Answer API (free, no API key needed)
            $response = $this->httpClient->request('GET', 'https://api.duckduckgo.com/', [
                'query' => [
                    'q' => $query,
                    'format' => 'json',
                    'no_html' => 1,
                    'skip_disambig' => 1,
                ],
                'timeout' => 10,
            ]);

            $data = $response->toArray();

            $results = [];

            // Abstract (main answer)
            if (!empty($data['Abstract'])) {
                $results[] = [
                    'title' => $data['Heading'] ?? 'Result',
                    'snippet' => $data['Abstract'],
                    'url' => $data['AbstractURL'] ?? '',
                    'source' => $data['AbstractSource'] ?? 'DuckDuckGo',
                ];
            }

            // Related topics
            if (!empty($data['RelatedTopics'])) {
                foreach (array_slice($data['RelatedTopics'], 0, $maxResults - count($results)) as $topic) {
                    if (isset($topic['Text'])) {
                        $results[] = [
                            'title' => $topic['FirstURL'] ?? '',
                            'snippet' => $topic['Text'],
                            'url' => $topic['FirstURL'] ?? '',
                            'source' => 'DuckDuckGo',
                        ];
                    }
                }
            }

            // If no results from DDG API, try HTML scraping as fallback
            if (empty($results)) {
                $results = $this->scrapeSearch($query, $maxResults);
            }

            return $results;

        } catch (\Exception $e) {
            return [
                [
                    'title' => 'Search Error',
                    'snippet' => 'Unable to perform web search: ' . $e->getMessage(),
                    'url' => '',
                    'source' => 'Error',
                ]
            ];
        }
    }

    /**
     * Fallback: scrape DuckDuckGo HTML results
     */
    private function scrapeSearch(string $query, int $maxResults): array
    {
        try {
            $response = $this->httpClient->request('GET', 'https://html.duckduckgo.com/html/', [
                'query' => ['q' => $query],
                'headers' => [
                    'User-Agent' => 'Mozilla/5.0 (compatible; QUERNEL-IA/1.0)',
                ],
                'timeout' => 10,
            ]);

            $html = $response->getContent();
            $results = [];

            // Simple regex to extract results
            preg_match_all('/<a class="result__a" href="([^"]+)"[^>]*>([^<]+)<\/a>.*?<a class="result__snippet"[^>]*>([^<]+)<\/a>/s', $html, $matches, PREG_SET_ORDER);

            foreach (array_slice($matches, 0, $maxResults) as $match) {
                $results[] = [
                    'title' => html_entity_decode($match[2]),
                    'snippet' => html_entity_decode($match[3]),
                    'url' => $match[1],
                    'source' => 'DuckDuckGo',
                ];
            }

            return $results;

        } catch (\Exception $e) {
            return [];
        }
    }

    /**
     * Format search results for the AI
     */
    public function formatResultsForAI(array $results): string
    {
        if (empty($results)) {
            return "Aucun résultat trouvé pour cette recherche.";
        }

        $formatted = "Résultats de recherche web:\n\n";

        foreach ($results as $i => $result) {
            $num = $i + 1;
            $formatted .= "{$num}. **{$result['title']}**\n";
            $formatted .= "   {$result['snippet']}\n";
            if (!empty($result['url'])) {
                $formatted .= "   Source: {$result['url']}\n";
            }
            $formatted .= "\n";
        }

        return $formatted;
    }
}
