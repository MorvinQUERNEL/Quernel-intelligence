import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
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

function AccordionItem({ faq, isOpen, onClick }: {
  faq: FAQItem;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={onClick}
        className="w-full py-5 flex items-center justify-between text-left group"
      >
        <span className={`text-sm font-medium pr-4 transition-colors duration-200 ${
          isOpen ? 'text-accent' : 'text-text-primary group-hover:text-accent'
        }`}>
          {faq.question}
        </span>
        <motion.svg
          className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${
            isOpen ? 'text-accent' : 'text-text-muted'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-text-secondary text-sm leading-relaxed">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Split FAQs into two columns
  const midPoint = Math.ceil(faqs.length / 2);
  const leftColumn = faqs.slice(0, midPoint);
  const rightColumn = faqs.slice(midPoint);

  return (
    <section id="faq" className="relative overflow-hidden">
      <div className="container">
        <SectionHeading
          badge="FAQ"
          title="Questions fréquentes"
          subtitle="Tout ce que vous devez savoir avant de démarrer."
          centered={false}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-0">
          {/* Left column */}
          <div>
            {leftColumn.map((faq, index) => (
              <AccordionItem
                key={index}
                faq={faq}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>

          {/* Right column */}
          <div>
            {rightColumn.map((faq, index) => {
              const actualIndex = index + midPoint;
              return (
                <AccordionItem
                  key={actualIndex}
                  faq={faq}
                  isOpen={openIndex === actualIndex}
                  onClick={() => setOpenIndex(openIndex === actualIndex ? null : actualIndex)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
