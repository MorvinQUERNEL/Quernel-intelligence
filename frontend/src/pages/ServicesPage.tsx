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
        description="Découvrez nos services : création de sites vitrines et e-commerce, agents IA intelligents, bots de trading algorithmique, automatisation des processus. Solutions digitales sur mesure."
        canonical="https://quernel-intelligence.com/services"
        jsonLd={[breadcrumbSchema, webServiceSchema, iaServiceSchema]}
      />
      <div className="pt-20">
        <Services />
      </div>
    </>
  );
}
