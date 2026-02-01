import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

function AccordionItem({ faq, index, isOpen, onClick }: {
  faq: FAQItem;
  index: number;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      className="border-b border-border"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <button
        onClick={onClick}
        className="w-full py-6 lg:py-8 flex items-start gap-6 text-left group"
      >
        {/* Index number */}
        <span className="font-mono text-xs text-text-muted pt-1">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Question */}
        <span className={`flex-1 text-lg lg:text-xl font-light transition-colors duration-300 ${
          isOpen ? 'text-accent' : 'text-text-primary group-hover:text-accent'
        }`}>
          {faq.question}
        </span>

        {/* Toggle icon */}
        <div className="relative w-6 h-6 flex-shrink-0 mt-1">
          <motion.span
            className="absolute top-1/2 left-0 w-full h-px bg-current"
            style={{ originX: 0.5 }}
            animate={{
              rotate: isOpen ? 0 : 0,
              backgroundColor: isOpen ? 'var(--color-accent)' : 'var(--color-text-muted)'
            }}
          />
          <motion.span
            className="absolute top-1/2 left-0 w-full h-px bg-current"
            animate={{
              rotate: isOpen ? 0 : 90,
              backgroundColor: isOpen ? 'var(--color-accent)' : 'var(--color-text-muted)'
            }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pl-12 pb-8 pr-12">
              <p className="text-text-secondary leading-relaxed max-w-2xl">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative bg-bg-primary overflow-hidden">
      <div className="container">
        {/* Header */}
        <motion.div
          className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 lg:mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-sm text-accent">004</span>
              <div className="h-px w-12 bg-accent" />
              <span className="font-mono text-xs text-text-muted tracking-wider">FAQ</span>
            </div>
            <h2 className="text-text-primary mb-4">
              QUESTIONS<br />
              <span className="text-accent">FRÉQUENTES</span>
            </h2>
          </div>

          <p className="text-text-secondary max-w-md mt-8 lg:mt-0 lg:text-right">
            Tout ce que vous devez savoir avant de démarrer votre projet digital.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="border-t border-border">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-16 lg:mt-24 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 lg:p-12 border border-border"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h4 className="font-display text-2xl text-text-primary mb-2">
              ENCORE DES QUESTIONS ?
            </h4>
            <p className="text-text-secondary">
              Notre équipe vous répond sous 24h.
            </p>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center gap-4 font-mono text-sm text-accent hover:text-accent-hover transition-colors"
          >
            <span>NOUS CONTACTER</span>
            <span className="w-8 h-px bg-current" />
          </a>
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 overflow-hidden pointer-events-none opacity-[0.02]">
        <span className="font-display text-[40vw] leading-none text-white">
          04
        </span>
      </div>
    </section>
  );
}
