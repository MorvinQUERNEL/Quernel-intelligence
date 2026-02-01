import { motion } from 'framer-motion';
import { SectionTitle } from '../ui/SectionTitle';

const steps = [
  {
    number: '01',
    title: 'Découverte',
    description: 'Nous analysons vos besoins, votre marché et vos objectifs pour définir la meilleure stratégie.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Conception',
    description: 'Nous créons les maquettes et l\'architecture technique de votre projet pour validation.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Développement',
    description: 'Notre équipe développe votre solution avec les dernières technologies et bonnes pratiques.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Lancement',
    description: 'Mise en ligne, formation et suivi pour garantir le succès de votre projet.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-[#111827]/30">
      <div className="container-custom">
        <SectionTitle
          title="Comment ça marche"
          subtitle="Un processus simple et efficace en 4 étapes"
        />

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2">
            <motion.div
              className="h-full bg-gradient-to-r from-[#00F0FF] via-[#7C3AED] to-[#10B981]"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{ transformOrigin: 'left' }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                {/* Step Card */}
                <div className="relative bg-[#1A1F35]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-[#00F0FF]/30 transition-all duration-300 group">
                  {/* Number badge */}
                  <div className="absolute -top-4 left-6 px-3 py-1 bg-gradient-to-r from-[#00F0FF] to-[#7C3AED] rounded-lg">
                    <span className="text-[#0A0E1A] font-bold font-[var(--font-mono)] text-sm">
                      {step.number}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-[#00F0FF]/10 flex items-center justify-center text-[#00F0FF] mb-4 mt-4 group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-[#F8FAFC] mb-3 font-[var(--font-orbitron)]">
                    {step.title}
                  </h3>
                  <p className="text-[#94A3B8] text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connection dot for desktop */}
                <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <motion.div
                    className="w-4 h-4 rounded-full bg-[#00F0FF]"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.15 }}
                    style={{
                      boxShadow: '0 0 20px rgba(0, 240, 255, 0.5)',
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
