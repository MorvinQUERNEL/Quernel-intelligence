import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { SectionTitle } from '../ui/SectionTitle';

const useCases = [
  {
    emoji: '🍽️',
    title: 'Restaurant + Chatbot IA',
    description: 'Un chatbot intégré au site et WhatsApp qui gère les réservations, répond aux questions sur le menu et envoie des rappels automatiques.',
    results: [
      '+40% de réservations en ligne',
      '-70% d\'appels entrants',
      '24/7 disponibilité',
    ],
    gradient: 'from-[#00F0FF] to-[#10B981]',
  },
  {
    emoji: '🛒',
    title: 'E-commerce + Relance Panier',
    description: 'Un agent IA qui analyse les paniers abandonnés, envoie des relances personnalisées par email et SMS avec des offres ciblées.',
    results: [
      '+25% de conversion panier',
      '+35% de CA mensuel',
      'ROI x8 en 3 mois',
    ],
    gradient: 'from-[#7C3AED] to-[#00F0FF]',
  },
  {
    emoji: '📈',
    title: 'Trading Bot Crypto',
    description: 'Un bot de trading automatisé qui analyse les tendances, exécute des ordres selon votre stratégie et gère les risques 24/7.',
    results: [
      'Analyse temps réel',
      'Exécution < 100ms',
      'Gestion risque auto',
    ],
    gradient: 'from-[#10B981] to-[#7C3AED]',
  },
];

export function UseCases() {
  return (
    <section className="relative overflow-hidden">
      <div className="container-custom">
        <SectionTitle
          title="Cas d'usage IA"
          subtitle="Découvrez comment nos solutions transforment les entreprises"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <GlassCard
                className="p-6 h-full group cursor-pointer"
                glowColor={index === 0 ? 'cyan' : index === 1 ? 'violet' : 'emerald'}
              >
                {/* Emoji Header */}
                <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform">
                  {useCase.emoji}
                </div>

                {/* Title with gradient */}
                <h3 className={`text-xl font-bold mb-4 font-[var(--font-orbitron)] bg-gradient-to-r ${useCase.gradient} bg-clip-text text-transparent`}>
                  {useCase.title}
                </h3>

                {/* Description */}
                <p className="text-[#94A3B8] text-sm mb-6 leading-relaxed">
                  {useCase.description}
                </p>

                {/* Results */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <p className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold">
                    Résultats
                  </p>
                  {useCase.results.map((result, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                    >
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${useCase.gradient}`} />
                      <span className="text-[#F8FAFC] text-sm font-medium">{result}</span>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
