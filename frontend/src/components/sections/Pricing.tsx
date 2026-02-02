import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Plan {
  id: string;
  index: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted: boolean;
}

const webPlans: Plan[] = [
  {
    id: 'essential',
    index: '01',
    name: 'ESSENTIEL',
    price: '499',
    description: 'Lancez votre présence en ligne en 2 semaines',
    features: ['Site vitrine 5 pages', 'Design professionnel', 'Formulaire de contact', 'Visible sur Google', 'Hébergement 1 an inclus'],
    highlighted: false,
  },
  {
    id: 'business',
    index: '02',
    name: 'BUSINESS',
    price: '999',
    description: 'Le choix de 70% de nos clients',
    features: ['Pages illimitées', 'Design sur mesure', 'Blog pour attirer du trafic', 'SEO optimisé', 'Maintenance 1 an', 'Formation incluse'],
    highlighted: true,
  },
  {
    id: 'premium',
    index: '03',
    name: 'PREMIUM',
    price: '1999',
    description: 'Vendez en ligne dès demain',
    features: ['Tout Business +', 'Boutique e-commerce', 'Paiement sécurisé CB', 'Gestion des stocks', 'Connexion comptabilité', 'Support prioritaire'],
    highlighted: false,
  },
];

const iaPlans: Plan[] = [
  {
    id: 'agent',
    index: '01',
    name: 'AGENT IA',
    price: '499',
    description: 'Ne perdez plus jamais un prospect',
    features: ['Assistant disponible 24h/24', 'Répond en 3 secondes', 'Qualifie vos contacts', 'Prend des RDV', '1000 conversations/mois'],
    highlighted: false,
  },
  {
    id: 'automation',
    index: '02',
    name: 'AUTOMATION PRO',
    price: '999',
    description: 'Récupérez 10h de travail par semaine',
    features: ['Tâches automatisées', 'CRM synchronisé', 'Emails envoyés seuls', 'Rapports générés', 'Tous vos outils connectés', 'Support prioritaire'],
    highlighted: true,
  },
  {
    id: 'trading',
    index: '03',
    name: 'TRADING BOT',
    price: '1499',
    description: 'Votre stratégie, automatisée',
    features: ['Bot sur mesure', 'Stratégie testée', '5 ans de backtesting', 'Risques maîtrisés', 'Tableau de bord live', 'Alertes sur mobile'],
    highlighted: false,
  },
];

type Tab = 'web' | 'ia';

export function Pricing() {
  const [activeTab, setActiveTab] = useState<Tab>('web');
  const plans = activeTab === 'web' ? webPlans : iaPlans;
  const navigate = useNavigate();

  return (
    <section id="pricing" className="relative bg-bg-secondary overflow-hidden">
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
              <span className="font-mono text-sm text-accent">003</span>
              <div className="h-px w-12 bg-accent" />
              <span className="font-mono text-xs text-text-muted tracking-wider">INVESTISSEMENT</span>
            </div>
            <h2 className="text-text-primary mb-4">
              TARIFS
            </h2>
            <p className="text-text-secondary max-w-md">
              Prix fixes, sans surprise. Paiement en 3x sans frais disponible. Satisfait ou remboursé 30 jours.
            </p>
          </div>

          {/* Tab switcher */}
          <div className="mt-8 lg:mt-0">
            <div className="inline-flex border border-border">
              {[
                { id: 'web', label: 'CRÉATION WEB' },
                { id: 'ia', label: 'SOLUTIONS IA' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`
                    px-6 py-3 font-mono text-sm tracking-wider transition-all duration-300
                    ${activeTab === tab.id
                      ? 'bg-accent text-bg-primary'
                      : 'text-text-muted hover:text-text-primary'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Plans grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid md:grid-cols-3 gap-0"
          >
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                className={`
                  group relative border border-border
                  ${plan.highlighted ? 'bg-bg-tertiary border-accent/30' : 'bg-bg-primary'}
                  ${index === 0 ? '' : 'md:-ml-px'}
                `}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                {/* Highlighted badge */}
                {plan.highlighted && (
                  <div className="absolute -top-px left-0 right-0 h-1 bg-accent" />
                )}

                <div className="p-8 lg:p-10">
                  {/* Index & Name */}
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <span className="font-mono text-xs text-text-muted block mb-2">
                        {plan.index}
                      </span>
                      <h3 className="text-text-primary text-2xl">
                        {plan.name}
                      </h3>
                    </div>
                    {plan.highlighted && (
                      <span className="font-mono text-[10px] text-accent border border-accent px-2 py-1">
                        LE + CHOISI
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-6xl lg:text-7xl text-text-primary">
                        {plan.price}
                      </span>
                      <span className="font-mono text-lg text-text-muted">€</span>
                    </div>
                    <p className="text-text-muted text-sm mt-2">
                      {plan.description}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-border mb-6" />

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-accent flex-shrink-0" />
                        <span className="text-text-secondary text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => navigate('/contact')}
                    className={`
                      w-full py-4 font-mono text-sm tracking-wider transition-all duration-300
                      ${plan.highlighted
                        ? 'bg-accent text-bg-primary hover:bg-accent-hover'
                        : 'border border-border text-text-primary hover:border-accent hover:text-accent'
                      }
                    `}
                  >
                    {plan.highlighted ? 'COMMENCER MAINTENANT' : 'DEMANDER UN DEVIS'}
                  </button>
                </div>

                {/* Hover accent */}
                <div className="absolute bottom-0 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-500" />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Combo offer */}
        <motion.div
          className="mt-16 lg:mt-24 border border-border bg-bg-primary p-8 lg:p-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 border border-accent flex items-center justify-center flex-shrink-0">
                <span className="font-display text-2xl text-accent">+</span>
              </div>
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h4 className="font-display text-2xl text-text-primary">PACK COMPLET WEB + IA</h4>
                  <span className="font-mono text-xs text-bg-primary bg-accent px-2 py-1">ÉCONOMISEZ 15%</span>
                </div>
                <p className="text-text-secondary">
                  Site web + assistant IA : doublez votre capacité à convertir sans effort supplémentaire.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/contact')}
              className="flex items-center gap-4 font-mono text-sm text-accent hover:text-accent-hover transition-colors whitespace-nowrap"
            >
              <span>RECEVOIR MON DEVIS PERSONNALISÉ</span>
              <span className="w-8 h-px bg-current" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 overflow-hidden pointer-events-none opacity-[0.02]">
        <span className="font-display text-[40vw] leading-none text-white">
          03
        </span>
      </div>
    </section>
  );
}
