import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { SectionTitle } from '../ui/SectionTitle';

const services = [
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Sites Vitrines',
    description: 'Une présence en ligne professionnelle et impactante pour présenter votre activité et attirer vos clients.',
    features: ['Design sur mesure', 'Responsive mobile', 'SEO optimisé'],
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'E-commerce',
    description: 'Boutiques en ligne performantes avec paiement sécurisé, gestion de stock et expérience client optimisée.',
    features: ['Paiement sécurisé', 'Gestion de stock', 'Tunnel de vente'],
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: 'Applications Web',
    description: 'Applications sur mesure avec tableaux de bord, API et fonctionnalités avancées pour digitaliser vos processus.',
    features: ['Dashboard admin', 'API sur mesure', 'Intégrations'],
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: 'Refonte',
    description: 'Modernisation complète de votre site existant avec un design actuel et des performances optimisées.',
    features: ['Design moderne', 'Migration données', 'Performances +'],
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

export function ServicesWeb() {
  return (
    <section id="services" className="relative overflow-hidden">
      <div className="container-custom">
        <SectionTitle
          title="Création Web"
          subtitle="Des solutions digitales sur mesure pour développer votre présence en ligne"
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
              <GlassCard className="p-6 h-full" glowColor="cyan">
                {/* Icon */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#00F0FF]/20 to-[#00F0FF]/5 flex items-center justify-center text-[#00F0FF] mb-5 group-hover:scale-110 transition-transform">
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
                      <svg className="w-4 h-4 text-[#00F0FF] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
