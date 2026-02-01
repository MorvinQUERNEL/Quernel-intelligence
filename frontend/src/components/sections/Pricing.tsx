import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { GlowButton } from '../ui/GlowButton';
import { SectionTitle } from '../ui/SectionTitle';

const webPlans = [
  {
    name: 'Essentiel',
    price: '499',
    description: 'Parfait pour démarrer votre présence en ligne',
    features: [
      'Site vitrine 5 pages',
      'Design responsive',
      'Formulaire de contact',
      'Optimisation SEO de base',
      'Hébergement 1 an inclus',
    ],
    popular: false,
  },
  {
    name: 'Business',
    price: '999',
    description: 'La solution complète pour les entreprises',
    features: [
      'Site vitrine 10 pages',
      'Design premium sur mesure',
      'Blog intégré',
      'SEO avancé + analytics',
      'Hébergement 1 an + maintenance',
      'Formation utilisateur',
    ],
    popular: true,
  },
  {
    name: 'Premium',
    price: '1999',
    description: 'E-commerce et applications complexes',
    features: [
      'E-commerce complet',
      'Paiement Stripe/PayPal',
      'Gestion des stocks',
      'Dashboard admin',
      'Intégrations tierces',
      'Support prioritaire 6 mois',
    ],
    popular: false,
  },
];

const iaPlans = [
  {
    name: 'Agent IA',
    price: '499',
    description: 'Chatbot intelligent pour votre site',
    features: [
      'Chatbot IA sur mesure',
      'Intégration site web',
      'FAQ automatisée',
      'Qualification de leads',
      '1000 conversations/mois',
    ],
    popular: false,
  },
  {
    name: 'Automation Pro',
    price: '999',
    description: 'Automatisez vos processus business',
    features: [
      'Workflows automatisés',
      'Intégration CRM/ERP',
      'Emails automatiques',
      'Rapports générés par IA',
      'API personnalisée',
      'Support dédié',
    ],
    popular: true,
  },
  {
    name: 'Trading Bot',
    price: '1499',
    description: 'Bot de trading personnalisé',
    features: [
      'Bot trading crypto/forex',
      'Stratégie sur mesure',
      'Backtesting inclus',
      'Gestion des risques',
      'Dashboard temps réel',
      'Alertes Telegram/Discord',
    ],
    popular: false,
  },
];

function PricingCard({ plan, type }: { plan: typeof webPlans[0]; type: 'web' | 'ia' }) {
  const glowColor = type === 'web' ? 'cyan' : 'violet';
  const accentColor = type === 'web' ? '#00F0FF' : '#7C3AED';

  return (
    <GlassCard
      className={`p-6 h-full relative ${plan.popular ? 'border-2' : ''}`}
      style={plan.popular ? { borderColor: accentColor } : {}}
      glowColor={glowColor}
    >
      {plan.popular && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
          style={{ backgroundColor: accentColor, color: '#0A0E1A' }}
        >
          POPULAIRE
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-[#F8FAFC] font-[var(--font-orbitron)] mb-2">
          {plan.name}
        </h3>
        <p className="text-[#94A3B8] text-sm mb-4">{plan.description}</p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold font-[var(--font-mono)]" style={{ color: accentColor }}>
            {plan.price}
          </span>
          <span className="text-[#94A3B8]">€</span>
        </div>
      </div>

      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm text-[#94A3B8]">
            <svg
              className="w-5 h-5 shrink-0 mt-0.5"
              style={{ color: accentColor }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <GlowButton
        className="w-full"
        variant={plan.popular ? 'primary' : 'secondary'}
        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
      >
        Choisir ce plan
      </GlowButton>
    </GlassCard>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="relative overflow-hidden bg-[#111827]/30">
      <div className="container-custom">
        <SectionTitle
          title="Tarification"
          subtitle="Des offres adaptées à tous les budgets et besoins"
        />

        {/* Web Plans */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-[#F8FAFC] mb-8 text-center font-[var(--font-orbitron)]">
            <span className="text-[#00F0FF]">Création</span> Web
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {webPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <PricingCard plan={plan} type="web" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* IA Plans */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-[#F8FAFC] mb-8 text-center font-[var(--font-orbitron)]">
            <span className="text-[#7C3AED]">Solutions</span> IA
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {iaPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <PricingCard plan={plan} type="ia" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Combo offer */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <GlassCard className="inline-block px-8 py-6 max-w-2xl" glowColor="emerald">
            <p className="text-[#10B981] font-semibold mb-2">Pack Combiné Web + IA</p>
            <p className="text-[#94A3B8] text-sm mb-4">
              Combinez un site web et une solution IA pour bénéficier d'une remise de <span className="text-[#F8FAFC] font-bold">15%</span> sur le total.
            </p>
            <GlowButton
              variant="outline"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Demander un devis personnalisé
            </GlowButton>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
