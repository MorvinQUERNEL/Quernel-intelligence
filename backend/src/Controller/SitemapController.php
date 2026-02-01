<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Controller for sitemap generation.
 */
final class SitemapController extends AbstractController
{
    private const BASE_URL = 'https://quernel-intelligence.com';

    /**
     * Static pages for the sitemap.
     *
     * @var array<array{loc: string, changefreq: string, priority: string}>
     */
    private const PAGES = [
        ['loc' => '/', 'changefreq' => 'weekly', 'priority' => '1.0'],
        ['loc' => '/#services', 'changefreq' => 'monthly', 'priority' => '0.8'],
        ['loc' => '/#portfolio', 'changefreq' => 'monthly', 'priority' => '0.8'],
        ['loc' => '/#about', 'changefreq' => 'monthly', 'priority' => '0.7'],
        ['loc' => '/#contact', 'changefreq' => 'monthly', 'priority' => '0.9'],
    ];

    #[Route('/api/sitemap.xml', name: 'api_sitemap', methods: ['GET'])]
    public function sitemap(): Response
    {
        $lastmod = (new \DateTimeImmutable())->format('Y-m-d');

        $xml = new \SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>');

        foreach (self::PAGES as $page) {
            $url = $xml->addChild('url');
            $url->addChild('loc', self::BASE_URL . $page['loc']);
            $url->addChild('lastmod', $lastmod);
            $url->addChild('changefreq', $page['changefreq']);
            $url->addChild('priority', $page['priority']);
        }

        $response = new Response($xml->asXML(), Response::HTTP_OK);
        $response->headers->set('Content-Type', 'application/xml; charset=UTF-8');
        $response->headers->set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours

        return $response;
    }
}
