import { Contact } from '../components/sections/Contact';
import { SEO, createBreadcrumbSchema, localBusinessSchema } from '../components/seo';

const breadcrumbSchema = createBreadcrumbSchema([
  { name: 'Accueil', url: 'https://quernel-intelligence.com/' },
  { name: 'Contact', url: 'https://quernel-intelligence.com/contact' },
]);

const contactPageSchema = {
  '@type': 'ContactPage',
  '@id': 'https://quernel-intelligence.com/contact#contactpage',
  url: 'https://quernel-intelligence.com/contact',
  name: 'Contact - Quernel Intelligence',
  description: 'Contactez notre équipe pour discuter de votre projet web ou IA. Réponse garantie sous 24h.',
  isPartOf: { '@id': 'https://quernel-intelligence.com/#website' },
  mainEntity: { '@id': 'https://quernel-intelligence.com/#localbusiness' },
};

export function ContactPage() {
  return (
    <>
      <SEO
        title="Contact - Discutons de Votre Projet"
        description="Contactez Quernel Intelligence pour votre projet de création web ou solution IA. Devis gratuit sous 24h. Basés à Vigneux-sur-Seine, nous intervenons dans toute la France."
        canonical="https://quernel-intelligence.com/contact"
        jsonLd={[breadcrumbSchema, contactPageSchema, localBusinessSchema]}
      />
      <div className="pt-20">
        <Contact />
      </div>
    </>
  );
}
