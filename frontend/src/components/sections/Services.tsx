import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Service {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  visual: 'web' | 'ia' | 'trading' | 'automation';
}

const services: Service[] = [
  {
    id: 'web',
    index: '001',
    title: 'CRÉATION WEB',
    subtitle: 'Sites & Applications',
    description: 'Des sites qui convertissent. Design moderne, performance optimale, SEO intégré. Chaque pixel compte.',
    features: ['Site Vitrine', 'E-Commerce', 'Application Web', 'Refonte'],
    visual: 'web',
  },
  {
    id: 'ia',
    index: '002',
    title: 'AGENTS IA',
    subtitle: 'Intelligence Autonome',
    description: 'Assistants virtuels 24/7. Ils répondent, qualifient, convertissent. Pendant que vous dormez.',
    features: ['Chatbots IA', 'Support Client', 'Qualification Leads', 'FAQ Dynamique'],
    visual: 'ia',
  },
  {
    id: 'trading',
    index: '003',
    title: 'BOTS TRADING',
    subtitle: 'Algorithmes Financiers',
    description: 'Stratégies automatisées. Backtesting rigoureux. Gestion du risque intégrée.',
    features: ['Crypto/Forex', 'Stratégies Custom', 'Backtesting', 'Alertes Telegram'],
    visual: 'trading',
  },
  {
    id: 'automation',
    index: '004',
    title: 'AUTOMATION',
    subtitle: 'Workflows Intelligents',
    description: 'Automatisez le répétitif. Connectez vos outils. Libérez votre temps.',
    features: ['Workflows', 'Intégrations API', 'Emails Auto', 'Rapports IA'],
    visual: 'automation',
  },
];

function ServiceVisual({ type }: { type: Service['visual'] }) {
  const visuals = {
    web: (
      <div className="relative w-full aspect-[4/3] bg-bg-secondary border border-border overflow-hidden">
        <div className="absolute inset-4 flex flex-col">
          <div className="flex gap-1.5 mb-4">
            <div className="w-2 h-2 rounded-full bg-accent/60" />
            <div className="w-2 h-2 rounded-full bg-text-muted/30" />
            <div className="w-2 h-2 rounded-full bg-text-muted/30" />
          </div>
          <div className="flex-1 grid grid-cols-3 gap-2">
            <div className="col-span-2 space-y-2">
              <div className="h-4 w-20 bg-accent/20" />
              <div className="h-2 w-full bg-border" />
              <div className="h-2 w-4/5 bg-border" />
              <div className="h-2 w-3/5 bg-border" />
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-border" />
              <div className="h-8 bg-accent/10" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-transparent" />
      </div>
    ),
    ia: (
      <div className="relative w-full aspect-[4/3] bg-bg-secondary border border-border overflow-hidden font-mono text-xs">
        <div className="absolute inset-4 flex flex-col gap-2">
          <div className="text-text-muted">$ agent --init</div>
          <div className="text-accent">✓ Connecté</div>
          <div className="text-text-secondary">Analyse en cours...</div>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-accent">Traitement actif</span>
          </div>
          <div className="mt-auto p-3 bg-bg-tertiary border border-border">
            <div className="text-text-muted mb-1">Stats 24h</div>
            <div className="flex justify-between">
              <span className="text-text-muted">Requêtes:</span>
              <span className="text-accent">1,247</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Résolution:</span>
              <span className="text-accent">94%</span>
            </div>
          </div>
        </div>
      </div>
    ),
    trading: (
      <div className="relative w-full aspect-[4/3] bg-bg-secondary border border-border overflow-hidden">
        <div className="absolute inset-4">
          {/* Fake chart */}
          <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
            <path
              d="M0,80 L20,70 L40,75 L60,50 L80,55 L100,30 L120,40 L140,20 L160,35 L180,15 L200,25"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="2"
            />
            <path
              d="M0,80 L20,70 L40,75 L60,50 L80,55 L100,30 L120,40 L140,20 L160,35 L180,15 L200,25 L200,100 L0,100 Z"
              fill="url(#gradient)"
              opacity="0.1"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute bottom-2 right-2 font-mono text-xs text-accent">
            +12.4%
          </div>
        </div>
      </div>
    ),
    automation: (
      <div className="relative w-full aspect-[4/3] bg-bg-secondary border border-border overflow-hidden">
        <div className="absolute inset-4 flex items-center justify-center">
          {/* Workflow diagram */}
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-center gap-4">
                <div className="w-12 h-12 border border-accent/50 flex items-center justify-center">
                  <span className="font-mono text-xs text-accent">0{n}</span>
                </div>
                {n < 3 && (
                  <div className="w-8 h-px bg-accent/50" />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-4 left-4 font-mono text-xs text-text-muted">
          WORKFLOW/ACTIVE
        </div>
      </div>
    ),
  };

  return visuals[type];
}

export function Services() {
  const [activeService, setActiveService] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <section id="services" className="relative bg-bg-primary overflow-hidden">
      {/* Section header */}
      <div className="container">
        <motion.div
          className="flex items-start justify-between mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-sm text-accent">002</span>
              <div className="h-px w-12 bg-accent" />
              <span className="font-mono text-xs text-text-muted tracking-wider">NOS EXPERTISES</span>
            </div>
            <h2 className="text-text-primary">
              SERVICES
            </h2>
          </div>
          <div className="hidden lg:block max-w-xs text-right">
            <p className="text-text-secondary text-sm">
              Quatre domaines d'expertise. Un seul objectif: votre croissance digitale.
            </p>
          </div>
        </motion.div>

        {/* Services list */}
        <div className="space-y-0">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              className="group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setActiveService(service.id)}
              onMouseLeave={() => setActiveService(null)}
            >
              {/* Divider */}
              <div className="h-px bg-border group-hover:bg-accent/30 transition-colors duration-500" />

              <div className="grid lg:grid-cols-12 gap-8 py-12 lg:py-16 items-center">
                {/* Index */}
                <div className="lg:col-span-1">
                  <span className="font-mono text-sm text-text-muted group-hover:text-accent transition-colors">
                    {service.index}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div className="lg:col-span-4">
                  <h3 className="text-text-primary group-hover:text-accent transition-colors duration-300 mb-2">
                    {service.title}
                  </h3>
                  <span className="font-mono text-xs text-text-muted tracking-wider">
                    {service.subtitle}
                  </span>
                </div>

                {/* Description */}
                <div className="lg:col-span-3">
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Features */}
                <div className="lg:col-span-3">
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-3 py-1 text-xs font-mono border border-border group-hover:border-accent/30 text-text-muted group-hover:text-text-secondary transition-all duration-300"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Arrow */}
                <div className="lg:col-span-1 flex justify-end">
                  <motion.div
                    className="w-10 h-10 border border-border group-hover:border-accent group-hover:bg-accent flex items-center justify-center transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-text-muted group-hover:text-bg-primary transition-colors">
                      →
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Expanded visual on hover - Desktop only */}
              <motion.div
                className="hidden lg:block overflow-hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: activeService === service.id ? 'auto' : 0,
                  opacity: activeService === service.id ? 1 : 0,
                }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                <div className="pb-12 grid grid-cols-12 gap-8">
                  <div className="col-span-1" />
                  <div className="col-span-5">
                    <ServiceVisual type={service.visual} />
                  </div>
                  <div className="col-span-5 flex items-center">
                    <div>
                      <p className="text-text-secondary mb-6 leading-relaxed">
                        {service.description} Chaque projet est unique, chaque solution est sur mesure.
                      </p>
                      <button
                        onClick={() => navigate('/contact')}
                        className="font-mono text-sm text-accent hover:text-accent-hover transition-colors flex items-center gap-3"
                      >
                        <span>EN SAVOIR PLUS</span>
                        <span className="w-6 h-px bg-current" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
          {/* Final divider */}
          <div className="h-px bg-border" />
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 overflow-hidden pointer-events-none opacity-[0.02]">
        <span className="font-display text-[40vw] leading-none text-white">
          02
        </span>
      </div>
    </section>
  );
}
