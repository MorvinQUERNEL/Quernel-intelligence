/**
 * Schema.org JSON-LD Schemas
 * Pre-defined schemas for SEO structured data
 */

const SITE_NAME = 'Quernel Intelligence';
const BASE_URL = 'https://quernel-intelligence.com';

// Pre-defined JSON-LD schemas
export const organizationSchema = {
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: SITE_NAME,
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/logo.png`,
    width: 512,
    height: 512,
  },
  sameAs: [],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'contact@quernel-intelligence.com',
    contactType: 'customer service',
    availableLanguage: ['French'],
    areaServed: 'FR',
  },
};

export const localBusinessSchema = {
  '@type': 'LocalBusiness',
  '@id': `${BASE_URL}/#localbusiness`,
  name: SITE_NAME,
  url: BASE_URL,
  image: `${BASE_URL}/logo.png`,
  description: 'Agence de création web et intelligence artificielle. Sites vitrines, e-commerce, agents IA, bots de trading.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Vigneux-sur-Seine',
    postalCode: '91270',
    addressRegion: 'Île-de-France',
    addressCountry: 'FR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 48.7005,
    longitude: 2.4169,
  },
  priceRange: '€€',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:00',
  },
};

export const websiteSchema = {
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  url: BASE_URL,
  name: SITE_NAME,
  description: 'Agence de création web et solutions IA sur mesure pour PME françaises',
  publisher: { '@id': `${BASE_URL}/#organization` },
  inLanguage: 'fr-FR',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/?s={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export const webServiceSchema = {
  '@type': 'Service',
  '@id': `${BASE_URL}/#service-web`,
  name: 'Création de Sites Internet',
  provider: { '@id': `${BASE_URL}/#organization` },
  description: 'Création de sites vitrines professionnels, sites e-commerce et développement web sur mesure pour PME françaises.',
  areaServed: { '@type': 'Country', name: 'France' },
  serviceType: 'Développement Web',
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '499',
    highPrice: '1999',
    priceCurrency: 'EUR',
  },
};

export const iaServiceSchema = {
  '@type': 'Service',
  '@id': `${BASE_URL}/#service-ia`,
  name: "Solutions d'Intelligence Artificielle",
  provider: { '@id': `${BASE_URL}/#organization` },
  description: "Agents IA, chatbots entreprise, bots de trading et automatisation IA pour optimiser votre activité.",
  areaServed: { '@type': 'Country', name: 'France' },
  serviceType: 'Intelligence Artificielle',
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '499',
    highPrice: '1499',
    priceCurrency: 'EUR',
  },
};

// Breadcrumb helper
export function createBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// FAQ Schema helper
export function createFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
