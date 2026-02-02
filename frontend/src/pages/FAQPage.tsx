import { FAQ } from '../components/sections/FAQ';
import { SEO, createBreadcrumbSchema, createFAQSchema } from '../components/seo';

const breadcrumbSchema = createBreadcrumbSchema([
  { name: 'Accueil', url: 'https://quernel-intelligence.com/' },
  { name: 'FAQ', url: 'https://quernel-intelligence.com/faq' },
]);

// FAQ data for Schema.org
const faqData = [
  {
    question: 'Combien coûte un site web ?',
    answer: 'Nos tarifs commencent à 499€ pour un site vitrine essentiel. Le prix varie selon la complexité : nombre de pages, fonctionnalités (e-commerce, blog, réservation), et intégrations spécifiques. Nous proposons toujours un devis détaillé gratuit.',
  },
  {
    question: 'Quel délai pour créer un site ?',
    answer: 'Un site vitrine prend généralement 2 à 4 semaines. Un site e-commerce ou une application web complexe nécessite 4 à 8 semaines. Ce délai inclut le design, le développement, les révisions et la mise en ligne.',
  },
  {
    question: 'Puis-je modifier mon site moi-même ?',
    answer: 'Oui, nous intégrons un système de gestion de contenu (CMS) intuitif et nous vous formons à son utilisation. Vous pouvez modifier textes, images et produits en toute autonomie.',
  },
  {
    question: "L'hébergement est-il inclus ?",
    answer: "Oui, la première année d'hébergement est incluse dans nos offres. Ensuite, nous proposons des forfaits maintenance et hébergement à partir de 15€/mois incluant sauvegardes, mises à jour et support.",
  },
  {
    question: "Qu'est-ce qu'un agent IA exactement ?",
    answer: "Un agent IA est un assistant virtuel intelligent intégré à votre site. Il comprend les questions de vos visiteurs grâce au traitement du langage naturel et y répond 24/7. Il peut qualifier des leads, répondre aux FAQ, prendre des rendez-vous.",
  },
  {
    question: 'Un bot de trading est-il risqué ?',
    answer: "Tout trading comporte des risques. Nos bots sont développés avec des systèmes de gestion des risques (stop-loss, position sizing). Nous effectuons un backtesting rigoureux et vous accompagnons dans la configuration. Le capital investi reste le vôtre.",
  },
  {
    question: "Comment l'IA peut aider mon e-commerce ?",
    answer: "L'IA optimise votre e-commerce avec des recommandations personnalisées (+15-30% de panier moyen), des relances panier abandonnées automatiques, la segmentation client, et un chatbot pour le support. ROI mesurable dès le premier mois.",
  },
  {
    question: 'Combien de temps pour mettre en place un agent IA ?',
    answer: "Un agent IA basique est opérationnel en 1 à 2 semaines. Ce délai inclut l'entraînement sur votre base de connaissances, les tests et l'intégration à votre site ou messagerie.",
  },
];

const faqSchema = createFAQSchema(faqData);

export function FAQPage() {
  return (
    <>
      <SEO
        title="FAQ - Questions Fréquentes"
        description="Réponses à vos questions sur la création de sites web, les tarifs, les délais, les agents IA et les bots de trading. Tout ce que vous devez savoir avant de démarrer votre projet."
        canonical="https://quernel-intelligence.com/faq"
        jsonLd={[breadcrumbSchema, faqSchema]}
      />
      <div className="pt-20">
        <FAQ />
      </div>
    </>
  );
}
