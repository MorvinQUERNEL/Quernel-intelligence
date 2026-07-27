import { Hero } from '../components/sections/Hero';
import {
  SEO,
  organizationSchema,
  localBusinessSchema,
  websiteSchema,
  webServiceSchema,
  iaServiceSchema,
} from '../components/seo';

export function HomePage() {
  return (
    <>
      <SEO
        title="Quernel Intelligence | Agents IA, Workflows & Audits pour Entreprises"
        description="Agents IA sur mesure, workflows automatisés et audits IA chiffrés pour PME françaises. Audit flash gratuit en ligne, démo des agents en direct. Création de sites web en complément."
        canonical="https://quernel-intelligence.com/"
        jsonLd={[
          organizationSchema,
          localBusinessSchema,
          websiteSchema,
          webServiceSchema,
          iaServiceSchema,
        ]}
      />
      <Hero />
    </>
  );
}
