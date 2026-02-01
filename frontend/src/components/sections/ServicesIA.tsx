import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { SectionTitle } from '../ui/SectionTitle';

const services = [
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: 'Agents IA',
    description: 'Assistants virtuels intelligents qui répondent à vos clients 24/7, qualifient les leads et automatisent le support.',
    features: ['Réponses 24/7', 'Qualification leads', 'Multi-langues'],
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: 'Bots de Trading',
    description: 'Algorithmes de trading automatisés qui analysent les marchés et exécutent des ordres selon vos stratégies.',
    features: ['Analyse temps réel', 'Backtesting', 'Gestion risques'],
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: 'Automatisation',
    description: 'Automatisez vos tâches répétitives : facturation, emails, rapports, synchronisation de données.',
    features: ['Workflows auto', 'Intégration CRM', 'Rapports auto'],
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l2 2" />
      </svg>
    ),
    title: 'IA E-commerce',
    description: 'Boostez vos ventes avec des recommandations personnalisées, relances panier et segmentation client.',
    features: ['Recommandations', 'Relance panier', 'Segmentation'],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export function ServicesIA() {
  return (
    <section id="ia-solutions" className="relative overflow-hidden bg-[#111827]/50">
      {/* Background neural connections */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          {/* Neural connection lines */}
          <motion.path
            d="M10,50 Q30,20 50,50 T90,50"
            stroke="url(#lineGrad)"
            strokeWidth="0.2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
          />
          <motion.path
            d="M20,30 Q50,60 80,30"
            stroke="url(#lineGrad)"
            strokeWidth="0.2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', delay: 0.5 }}
          />
          <motion.path
            d="M15,70 Q50,40 85,70"
            stroke="url(#lineGrad)"
            strokeWidth="0.2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3.5, repeat: Infinity, repeatType: 'reverse', delay: 1 }}
          />
        </svg>
      </div>

      <div className="container-custom relative z-10">
        <SectionTitle
          title="Solutions IA"
          subtitle="L'intelligence artificielle au service de votre business"
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={itemVariants}>
              <GlassCard className="p-6 h-full" glowColor="violet">
                {/* Icon */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#7C3AED]/20 to-[#7C3AED]/5 flex items-center justify-center text-[#7C3AED] mb-5">
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-[#F8FAFC] mb-3 font-[var(--font-orbitron)]">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-[#94A3B8] text-sm mb-5 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-[#94A3B8]">
                      <svg className="w-4 h-4 text-[#7C3AED] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
