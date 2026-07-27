import { Services } from '../components/sections/Services';
import {
  SEO,
  webServiceSchema,
  iaServiceSchema,
  createBreadcrumbSchema,
} from '../components/seo';

const breadcrumbSchema = createBreadcrumbSchema([
  { name: 'Accueil', url: 'https://quernel-intelligence.com/' },
  { name: 'Services', url: 'https://quernel-intelligence.com/services' },
]);

export function ServicesPage() {
  return (
    <>
      <SEO
        title="Nos Services - Création Web & Solutions IA"
        description="Nos services : agents IA métier, workflows d'automatisation, audits IA chiffrés, et création de sites vitrines et e-commerce. Solutions sur mesure pour PME."
        canonical="https://quernel-intelligence.com/services"
        jsonLd={[breadcrumbSchema, webServiceSchema, iaServiceSchema]}
      />
      <div className="pt-20">
        <Services />
      </div>
    </>
  );
}
