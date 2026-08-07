import { Hero } from '../components/sections/Hero';
import { PlatformPromo } from '../components/sections/PlatformPromo';
import {
  SEO,
  organizationSchema,
  localBusinessSchema,
  websiteSchema,
  webServiceSchema,
  iaServiceSchema,
  platformSchema,
} from '../components/seo';

export function HomePage() {
  return (
    <>
      <SEO
        title="Agents IA pour PME | Quernel Intelligence — plateforme et audits IA"
        description="Déployez une équipe de 9 agents IA spécialisés pour votre PME : prospection, support client, administratif, contenu, analyse. Plateforme testable gratuitement, dès 99 €/mois. Audit IA flash gratuit."
        canonical="https://quernel-intelligence.com/"
        jsonLd={[
          organizationSchema,
          localBusinessSchema,
          websiteSchema,
          webServiceSchema,
          iaServiceSchema,
          platformSchema,
        ]}
      />
      <Hero />
      <PlatformPromo />
    </>
  );
}
