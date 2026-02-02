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
        title="Quernel Intelligence | Création de Sites Internet & Solutions IA"
        description="Agence de création web et intelligence artificielle à Vigneux-sur-Seine. Sites vitrines, e-commerce, agents IA, bots de trading. Solutions sur mesure pour PME françaises. Devis gratuit."
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
