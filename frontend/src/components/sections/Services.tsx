import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';

interface ServiceItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const webServices: ServiceItem[] = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Site Vitrine',
    description: 'Présence en ligne professionnelle et impactante',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'E-Commerce',
    description: 'Boutique en ligne avec paiement sécurisé',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: 'Application Web',
    description: 'Outils sur mesure avec dashboard et API',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: 'Refonte',
    description: 'Modernisation et optimisation de votre site',
  },
];

const iaServices: ServiceItem[] = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: 'Agents IA',
    description: 'Assistants virtuels 24/7 pour vos clients',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: 'Bots de Trading',
    description: 'Algorithmes automatisés pour les marchés',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    title: 'Automatisation',
    description: 'Workflows et intégrations automatisés',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'IA E-Commerce',
    description: 'Recommandations et relances intelligentes',
  },
];

interface ServiceCardProps {
  service: ServiceItem;
  index: number;
}

const ServiceCard = ({ service, index }: ServiceCardProps) => (
  <motion.div
    className="group flex items-center gap-5 p-5 rounded-xl border border-border bg-bg-secondary/50 hover:border-border-hover hover:bg-bg-tertiary/50 transition-all duration-200 cursor-pointer"
    initial={{ opacity: 0, x: -10 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    whileHover={{ x: 4 }}
  >
    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
      {service.icon}
    </div>
    <div className="flex-grow min-w-0">
      <h4 className="text-text-primary font-medium text-sm mb-1">{service.title}</h4>
      <p className="text-text-muted text-sm truncate">{service.description}</p>
    </div>
    <svg
      className="w-4 h-4 text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all duration-200 flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </motion.div>
);

export function Services() {
  return (
    <section id="services" className="relative overflow-hidden">
      <div className="container">
        <SectionHeading
          badge="Nos Services"
          title="Deux expertises. Un seul partenaire."
          subtitle="De la création web aux solutions IA, nous couvrons toute votre transformation digitale."
        />

        {/* Web Creation - Left visual, Right content */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
          {/* Visual */}
          <motion.div
            className="relative order-2 lg:order-1"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="aspect-[4/3] bg-bg-secondary border border-border rounded-xl overflow-hidden relative">
              {/* Browser mockup content */}
              <div className="absolute inset-0 p-6">
                <div className="flex gap-1.5 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <div className="space-y-3">
                  <div className="h-6 w-24 bg-bg-tertiary rounded" />
                  <div className="h-3 w-full bg-bg-tertiary rounded" />
                  <div className="h-3 w-4/5 bg-bg-tertiary rounded" />
                  <div className="h-3 w-3/5 bg-bg-tertiary rounded" />
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="h-16 bg-bg-tertiary rounded" />
                    <div className="h-16 bg-bg-tertiary rounded" />
                    <div className="h-16 bg-bg-tertiary rounded" />
                  </div>
                </div>
              </div>
              {/* Accent decoration */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/0 via-accent to-accent/0" />
            </div>
          </motion.div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-semibold mb-3">Création Web</h3>
              <p className="text-text-secondary mb-6">
                Des sites qui convertissent, pas juste qui existent. Design moderne,
                performance optimisée, SEO intégré.
              </p>
            </motion.div>

            <div className="space-y-4">
              {webServices.map((service, index) => (
                <ServiceCard key={service.title} service={service} index={index} />
              ))}
            </div>
          </div>
        </div>

        {/* IA Solutions - Left content, Right visual */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-semibold mb-3">Solutions IA</h3>
              <p className="text-text-secondary mb-6">
                L'IA concrète qui génère du chiffre d'affaires. Automatisation,
                assistance client, et analyse prédictive.
              </p>
            </motion.div>

            <div className="space-y-4">
              {iaServices.map((service, index) => (
                <ServiceCard key={service.title} service={service} index={index} />
              ))}
            </div>
          </div>

          {/* Visual */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="aspect-[4/3] bg-bg-secondary border border-border rounded-xl overflow-hidden relative">
              {/* Terminal mockup */}
              <div className="absolute inset-0 p-6">
                <div className="flex gap-1.5 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <div className="font-mono text-xs space-y-2">
                  <div className="text-text-muted">$ agent-ia --start</div>
                  <div className="text-success">✓ Agent connecté</div>
                  <div className="text-text-secondary">Analyse en cours...</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                    <span className="text-accent">Traitement des demandes clients</span>
                  </div>
                  <div className="mt-4 p-3 bg-bg-tertiary rounded-lg">
                    <div className="text-text-muted mb-1">Statistiques 24h</div>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <span className="text-text-muted">Requêtes:</span>
                        <span className="text-text-primary ml-1">1,247</span>
                      </div>
                      <div>
                        <span className="text-text-muted">Résolution:</span>
                        <span className="text-success ml-1">94%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Accent decoration */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/0 via-accent to-accent/0" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
