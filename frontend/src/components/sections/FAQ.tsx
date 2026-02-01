import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionTitle } from '../ui/SectionTitle';

const webFaqs = [
  {
    question: 'Combien de temps pour créer un site web ?',
    answer: 'Un site vitrine prend généralement 2 à 4 semaines. Un site e-commerce ou une application web complexe peut nécessiter 4 à 8 semaines selon les fonctionnalités.',
  },
  {
    question: 'Le site sera-t-il optimisé pour mobile ?',
    answer: 'Absolument ! Tous nos sites sont développés en "mobile-first". Ils s\'adaptent parfaitement à tous les écrans : smartphones, tablettes et ordinateurs.',
  },
  {
    question: 'Proposez-vous l\'hébergement et la maintenance ?',
    answer: 'Oui, nous proposons des formules d\'hébergement haute performance et de maintenance incluant les mises à jour, sauvegardes et support technique.',
  },
  {
    question: 'Puis-je modifier mon site moi-même ?',
    answer: 'Oui, nous intégrons un système de gestion de contenu (CMS) intuitif et nous vous formons à son utilisation pour que vous puissiez mettre à jour vos contenus en autonomie.',
  },
];

const iaFaqs = [
  {
    question: 'Comment fonctionne un agent IA ?',
    answer: 'Un agent IA utilise l\'intelligence artificielle pour comprendre les questions de vos visiteurs et y répondre automatiquement. Il apprend de votre base de connaissances et s\'améliore avec le temps.',
  },
  {
    question: 'Le bot de trading est-il rentable ?',
    answer: 'Les performances dépendent de la stratégie et des conditions de marché. Nous développons des bots selon vos critères avec backtesting préalable, mais le trading comporte toujours des risques.',
  },
  {
    question: 'Quelles intégrations sont possibles ?',
    answer: 'Nous pouvons intégrer nos solutions IA avec la plupart des outils : CRM (Salesforce, Hubspot), e-commerce (Shopify, WooCommerce), messageries (WhatsApp, Telegram), et vos APIs existantes.',
  },
  {
    question: 'Les données sont-elles sécurisées ?',
    answer: 'La sécurité est notre priorité. Vos données sont chiffrées, stockées en Europe (RGPD compliant) et nous ne les partageons jamais avec des tiers.',
  },
];

function FAQItem({ faq, isOpen, onClick, color }: {
  faq: { question: string; answer: string };
  isOpen: boolean;
  onClick: () => void;
  color: string;
}) {
  return (
    <motion.div
      className="border-b border-white/10 last:border-0"
      initial={false}
    >
      <button
        onClick={onClick}
        className="w-full py-5 flex items-center justify-between text-left group"
      >
        <span className="text-[#F8FAFC] font-medium pr-4 group-hover:text-[#00F0FF] transition-colors">
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <svg
            className="w-6 h-6"
            style={{ color: isOpen ? color : '#94A3B8' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M6 12h12" />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-[#94A3B8] leading-relaxed">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  const [openWebIndex, setOpenWebIndex] = useState<number | null>(0);
  const [openIaIndex, setOpenIaIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative overflow-hidden bg-[#111827]/30">
      <div className="container-custom">
        <SectionTitle
          title="Questions Fréquentes"
          subtitle="Tout ce que vous devez savoir avant de démarrer"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Web FAQs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-[#1A1F35]/50 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/10">
              <h3 className="text-xl font-bold mb-6 font-[var(--font-orbitron)] flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg bg-[#00F0FF]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#00F0FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <span className="text-[#00F0FF]">Création Web</span>
              </h3>
              {webFaqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  faq={faq}
                  isOpen={openWebIndex === index}
                  onClick={() => setOpenWebIndex(openWebIndex === index ? null : index)}
                  color="#00F0FF"
                />
              ))}
            </div>
          </motion.div>

          {/* IA FAQs */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-[#1A1F35]/50 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/10">
              <h3 className="text-xl font-bold mb-6 font-[var(--font-orbitron)] flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg bg-[#7C3AED]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </span>
                <span className="text-[#7C3AED]">Solutions IA</span>
              </h3>
              {iaFaqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  faq={faq}
                  isOpen={openIaIndex === index}
                  onClick={() => setOpenIaIndex(openIaIndex === index ? null : index)}
                  color="#7C3AED"
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
