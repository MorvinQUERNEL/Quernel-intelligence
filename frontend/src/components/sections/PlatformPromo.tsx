import { motion } from 'framer-motion';

const PLATFORM_URL = 'https://agents.quernel-cloud.com';

const AGENTS = [
  'Prospecteur',
  'Support client',
  'Assistant admin',
  'Créateur de contenu',
  'Analyste',
  'Veilleur',
  'Marketing digital',
  'Coach commercial',
  'Auditeur IA',
];

/**
 * Section vitrine du produit phare : la plateforme SaaS agents.quernel-cloud.com.
 * Positionnée juste après le Hero — c'est « l'outil que les entreprises s'arrachent ».
 * SEO : contenu riche en mot-clé « agents IA », lien vers le produit, section
 * indexable rendue par React (Googlebot exécute le JS).
 */
export function PlatformPromo() {
  return (
    <section className="relative py-24 border-t border-border overflow-hidden bg-bg-primary">
      <div className="container relative z-10">
        {/* En-tête */}
        <motion.div
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-sm text-accent">002</span>
          <div className="h-px w-12 bg-accent" />
          <span className="font-mono text-xs text-text-muted tracking-wider">LE NOUVEL OUTIL</span>
          <span className="ml-2 bg-accent px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider text-bg-primary">
            NOUVEAU
          </span>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Colonne texte */}
          <div className="lg:col-span-7">
            <motion.h2
              className="text-text-primary text-4xl md:text-6xl font-display leading-[0.9]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              L'ÉQUIPE DE <span className="text-accent">9 AGENTS IA</span> QUE LES ENTREPRISES S'ARRACHENT.
            </motion.h2>

            <motion.p
              className="text-lg text-text-secondary mt-8 max-w-2xl font-light"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <strong className="text-text-primary">agents.quernel-cloud.com</strong> — une plateforme d'agents IA
              prête à l'emploi. Déployez une équipe d'IA spécialisée en quelques minutes, sans développement, sans
              projet à rallonge. Chaque agent produit de vrais livrables — devis, emails, posts, rapports —
              <span className="text-accent"> et vous gardez le contrôle : rien ne part sans votre validation.</span>
            </motion.p>

            {/* Liste agents */}
            <motion.ul
              className="flex flex-wrap gap-2 mt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {AGENTS.map((a) => (
                <li
                  key={a}
                  className="border border-border px-3 py-1.5 font-mono text-xs text-text-secondary hover:border-accent/50 transition-colors"
                >
                  {a}
                </li>
              ))}
            </motion.ul>

            {/* CTA */}
            <motion.div
              className="flex flex-wrap items-center gap-6 mt-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <a
                href={PLATFORM_URL}
                target="_blank"
                rel="noopener"
                className="group relative px-8 py-4 bg-accent text-bg-primary font-semibold text-sm tracking-wide overflow-hidden transition-all duration-300 hover:pr-12"
              >
                <span className="relative z-10">TESTER LES AGENTS — GRATUIT</span>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </a>
              <span className="font-mono text-xs text-text-muted">
                Sans inscription · dès 99 €/mois pour passer au réel
              </span>
            </motion.div>
          </div>

          {/* Colonne visuelle : chiffres clés */}
          <div className="lg:col-span-5">
            <motion.div
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {[
                { number: '9', label: 'AGENTS IA', sublabel: 'Prêts à l’emploi' },
                { number: '0 €', label: 'DÉMO', sublabel: 'Sans inscription' },
                { number: '5 min', label: 'DÉPLOIEMENT', sublabel: 'Pas de projet IT' },
                { number: '99 €', label: 'DÈS /MOIS', sublabel: 'Résiliable' },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="group relative p-6 border border-border hover:border-accent/50 transition-colors duration-300"
                >
                  <div className="absolute top-2 right-2 font-mono text-[10px] text-text-muted">00{index + 1}</div>
                  <div className="font-display text-4xl md:text-5xl text-accent mb-2">{stat.number}</div>
                  <div className="font-mono text-xs text-text-muted tracking-wider">{stat.label}</div>
                  <div className="font-mono text-[10px] text-text-muted/50 mt-1">{stat.sublabel}</div>
                  <div className="absolute bottom-0 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-500" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
