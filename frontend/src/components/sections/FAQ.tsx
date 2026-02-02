import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'Combien coûte un site web ?',
    answer: 'À partir de 499€ pour un site vitrine professionnel. Le prix dépend de vos besoins : nombre de pages, boutique en ligne, réservation en ligne... On vous envoie un devis détaillé gratuit sous 24h, sans engagement. Et vous pouvez payer en 3x sans frais.',
  },
  {
    question: 'En combien de temps mon site sera-t-il en ligne ?',
    answer: 'Comptez 2 à 3 semaines pour un site vitrine, 4 à 6 semaines pour un e-commerce. On vous tient informé à chaque étape et vous validez le design avant le développement. Pas de mauvaise surprise.',
  },
  {
    question: 'Pourrai-je modifier mon site moi-même ?',
    answer: 'Absolument. On installe un espace d\'administration simple, comme modifier un document Word. Textes, photos, produits : vous gérez tout seul. Et on vous forme gratuitement pour être autonome dès le premier jour.',
  },
  {
    question: 'L\'hébergement est-il inclus ?',
    answer: 'Oui, la première année est offerte. Ensuite, le forfait maintenance démarre à 15€/mois. Il inclut l\'hébergement, les sauvegardes automatiques, les mises à jour de sécurité et notre support par email.',
  },
  {
    question: 'C\'est quoi un agent IA, concrètement ?',
    answer: 'C\'est un assistant virtuel sur votre site qui répond à vos visiteurs 24h/24. Il comprend leurs questions, donne des réponses personnalisées, qualifie les contacts intéressants et peut même prendre des rendez-vous dans votre agenda. Comme un collaborateur qui ne dort jamais.',
  },
  {
    question: 'Les bots de trading sont-ils risqués ?',
    answer: 'Le trading comporte toujours des risques, bot ou pas. Notre différence : on teste chaque stratégie sur 5 ans de données historiques avant de la déployer. On intègre des limites de pertes automatiques. Et surtout, vous gardez le contrôle total de votre capital à tout moment.',
  },
  {
    question: 'Que peut faire l\'IA pour ma boutique en ligne ?',
    answer: 'Beaucoup ! Recommander les bons produits à chaque visiteur (+20% de panier moyen en moyenne), relancer automatiquement les paniers abandonnés, répondre aux questions clients instantanément. Des résultats mesurables dès les premières semaines.',
  },
  {
    question: 'Et si je ne suis pas satisfait ?',
    answer: 'Garantie satisfait ou remboursé pendant 30 jours. Si le résultat ne vous convient pas, on vous rembourse intégralement, sans discussion. C\'est notre engagement qualité.',
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
            Les réponses aux questions que vous vous posez. Et si la vôtre n'y est pas, on est là.
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
              UNE QUESTION ? UN DOUTE ?
            </h4>
            <p className="text-text-secondary">
              Écrivez-nous, on vous répond personnellement sous 24h.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-4 font-mono text-sm text-accent hover:text-accent-hover transition-colors"
          >
            <span>POSER MA QUESTION</span>
            <span className="w-8 h-px bg-current" />
          </Link>
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
