import { Pricing } from '../components/sections/Pricing';
import { SEO, createBreadcrumbSchema } from '../components/seo';

const breadcrumbSchema = createBreadcrumbSchema([
  { name: 'Accueil', url: 'https://quernel-intelligence.com/' },
  { name: 'Tarifs', url: 'https://quernel-intelligence.com/tarifs' },
]);

const pricingSchema = {
  '@type': 'WebPage',
  '@id': 'https://quernel-intelligence.com/tarifs#webpage',
  url: 'https://quernel-intelligence.com/tarifs',
  name: 'Tarifs - Création Web & Solutions IA | Quernel Intelligence',
  description: 'Découvrez nos tarifs transparents pour la création de sites web et solutions IA. À partir de 499€.',
  isPartOf: { '@id': 'https://quernel-intelligence.com/#website' },
  about: [
    { '@id': 'https://quernel-intelligence.com/#service-web' },
    { '@id': 'https://quernel-intelligence.com/#service-ia' },
  ],
};

const offersSchema = {
  '@type': 'ItemList',
  name: 'Offres Création Web',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'Offer',
        name: 'Site Essentiel',
        description: 'Site vitrine 5 pages avec design responsive',
        price: '499',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'Offer',
        name: 'Site Business',
        description: 'Pages illimitées, blog intégré, SEO avancé',
        price: '999',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
      },
    },
    {
      '@type': 'ListItem',
      position: 3,
      item: {
        '@type': 'Offer',
        name: 'Site Premium',
        description: 'E-commerce complet avec paiement sécurisé',
        price: '1999',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
      },
    },
  ],
};

export function PricingPage() {
  return (
    <>
      <SEO
        title="Tarifs - Création Web & Solutions IA"
        description="Tarifs transparents pour la création de sites web (à partir de 499€) et solutions IA (agents IA, bots trading). Devis gratuit. Zéro surprise. Paiement en plusieurs fois possible."
        canonical="https://quernel-intelligence.com/tarifs"
        jsonLd={[breadcrumbSchema, pricingSchema, offersSchema]}
      />
      <div className="pt-20">
        <Pricing />
      </div>
    </>
  );
}
