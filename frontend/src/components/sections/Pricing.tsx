import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface Plan {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular: boolean;
}

const webPlans: Plan[] = [
  {
    name: 'Essentiel',
    price: '499',
    description: 'Parfait pour démarrer',
    features: [
      'Site vitrine 5 pages',
      'Design responsive',
      'Formulaire de contact',
      'SEO de base',
      'Hébergement 1 an',
    ],
    popular: false,
  },
  {
    name: 'Business',
    price: '999',
    description: 'La solution complète',
    features: [
      'Pages illimitées',
      'Design premium sur mesure',
      'Blog intégré',
      'SEO avancé + analytics',
      'Hébergement + maintenance',
      'Formation utilisateur',
    ],
    popular: true,
  },
  {
    name: 'Premium',
    price: '1999',
    description: 'E-commerce & apps',
    features: [
      'Tout Business +',
      'E-commerce complet',
      'Paiement sécurisé',
      'Gestion des stocks',
      'API personnalisée',
      'Support prioritaire',
    ],
    popular: false,
  },
];

const iaPlans: Plan[] = [
  {
    name: 'Agent IA',
    price: '499',
    description: 'Chatbot intelligent',
    features: [
      'Chatbot IA sur mesure',
      'Intégration site web',
      'FAQ automatisée',
      'Qualification leads',
      '1000 conv./mois',
    ],
    popular: false,
  },
  {
    name: 'Automation Pro',
    price: '999',
    description: 'Processus automatisés',
    features: [
      'Workflows automatisés',
      'Intégration CRM/ERP',
      'Emails automatiques',
      'Rapports IA',
      'API personnalisée',
      'Support dédié',
    ],
    popular: true,
  },
  {
    name: 'Trading Bot',
    price: '1499',
    description: 'Bot personnalisé',
    features: [
      'Bot crypto/forex',
      'Stratégie sur mesure',
      'Backtesting inclus',
      'Gestion des risques',
      'Dashboard temps réel',
      'Alertes Telegram',
    ],
    popular: false,
  },
];

function PricingCard({ plan }: { plan: Plan }) {
  return (
    <Card variant={plan.popular ? 'featured' : 'default'} className="p-6 h-full flex flex-col">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-text-primary mb-1">{plan.name}</h3>
        <p className="text-text-muted text-sm mb-4">{plan.description}</p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold font-mono text-text-primary">{plan.price}</span>
          <span className="text-text-muted">€</span>
        </div>
      </div>

      <ul className="space-y-3 mb-6 flex-grow">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm text-text-secondary">
            <svg
              className="w-4 h-4 text-accent shrink-0 mt-0.5"
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

      <Button
        variant={plan.popular ? 'primary' : 'secondary'}
        className="w-full"
        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
      >
        Choisir
      </Button>
    </Card>
  );
}

type Tab = 'web' | 'ia';

export function Pricing() {
  const [activeTab, setActiveTab] = useState<Tab>('web');
  const plans = activeTab === 'web' ? webPlans : iaPlans;

  return (
    <section id="pricing" className="relative overflow-hidden bg-bg-secondary/30">
      <div className="container">
        <SectionHeading
          badge="Tarifs"
          title="Des prix clairs. Zéro surprise."
          subtitle="Choisissez la formule adaptée à votre projet."
        />

        {/* Tab switcher */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center bg-bg-secondary border border-border rounded-lg p-1">
            <button
              onClick={() => setActiveTab('web')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'web'
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Création Web
            </button>
            <button
              onClick={() => setActiveTab('ia')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'ia'
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Solutions IA
            </button>
          </div>
        </div>

        {/* Plans grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <PricingCard plan={plan} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Combo offer */}
        <motion.div
          className="mt-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="bg-bg-tertiary border border-border rounded-xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-accent-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-text-primary">Pack Combiné Web + IA</h4>
                    <Badge variant="accent">-15%</Badge>
                  </div>
                  <p className="text-text-secondary text-sm">
                    Combinez site web et solution IA pour une transformation digitale complète.
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="flex-shrink-0"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Demander un devis
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
