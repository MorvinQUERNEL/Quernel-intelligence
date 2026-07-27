import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SEO, createBreadcrumbSchema } from '../components/seo';

const DEMO_BASE = 'https://agents.quernel-cloud.com';

interface Agent {
  slug: string;
  index: string;
  name: string;
  role: string;
  pitch: string;
  missions: string[];
  gain: string;
  gainNote: string;
}

const agents: Agent[] = [
  {
    slug: 'auditeur-ia',
    index: '001',
    name: 'AUDITEUR IA',
    role: 'Le point de départ',
    pitch: 'Il cartographie vos processus et chiffre ce que l\'IA peut vous rapporter — en fourchettes honnêtes, avec les hypothèses de calcul. Il vous dit aussi ce que l\'IA ne réglera pas.',
    missions: ['Cartographie des processus', 'Gains chiffrés par opportunité', 'Plan de mise en œuvre priorisé'],
    gain: '8-12 h/sem',
    gainNote: 'identifiées en moyenne dans une PME de services',
  },
  {
    slug: 'prospecteur',
    index: '002',
    name: 'PROSPECTEUR',
    role: 'Trouve vos futurs clients',
    pitch: 'Il repère les entreprises qui ont un signal d\'achat, les qualifie et rédige des séquences d\'emails réellement personnalisées. Vous validez, il prépare.',
    missions: ['Cibles qualifiées avec signal d\'achat sourcé', 'Séquences ouverture + 2 relances', 'Fiches prospects prêtes pour le RDV'],
    gain: '10-20 cibles',
    gainNote: 'qualifiées et argumentées par session',
  },
  {
    slug: 'support-client',
    index: '003',
    name: 'SUPPORT CLIENT',
    role: 'Aucune demande sans réponse',
    pitch: 'Il trie votre boîte de réception, fait remonter les urgences et prépare des brouillons de réponse dans votre ton. Rien ne part sans votre validation.',
    missions: ['Tri urgent / commercial / courant', 'To-do quotidienne priorisée', 'Brouillons prêts à envoyer'],
    gain: '30-45 min/jour',
    gainNote: 'récupérées sur le traitement des emails',
  },
  {
    slug: 'assistant-admin',
    index: '004',
    name: 'ASSISTANT ADMIN',
    role: 'Devis, relances, facturation',
    pitch: 'Il prépare vos devis dans votre format, rédige des relances d\'impayés graduées et tient le suivi. Il n\'invente jamais un montant : vos prix restent vos prix.',
    missions: ['Devis structurés à partir de votre grille', 'Relances graduées J+7 / J+21 / J+35', 'Suivi de facturation'],
    gain: '45 → 15 min',
    gainNote: 'par devis, mesuré chez un client type',
  },
  {
    slug: 'createur-contenu',
    index: '005',
    name: 'CRÉATEUR DE CONTENU',
    role: 'Votre visibilité, régulière',
    pitch: 'Posts LinkedIn, scripts courts, emails : il écrit dans votre ton, avec de vrais frameworks de copywriting, et sans jargon creux. Prêt à publier.',
    missions: ['Posts et carrousels prêts à publier', 'Hooks en 2 variantes à tester', 'Emails de relance et de nurturing'],
    gain: '2-3 publications',
    gainNote: 'par semaine sans y passer vos soirées',
  },
  {
    slug: 'analyste',
    index: '006',
    name: 'ANALYSTE',
    role: 'La preuve par les chiffres',
    pitch: 'Il mesure ce que les autres agents rapportent vraiment : rapports comparés à une référence, plan d\'optimisation 30 jours. Il refuse d\'inventer un chiffre.',
    missions: ['Rapports de performance vs baseline', 'Plan d\'action 30 jours', 'Jamais de métrique inventée'],
    gain: '1 rapport/mois',
    gainNote: 'qui dit ce qui marche et ce qui ne marche pas',
  },
];

const breadcrumbSchema = createBreadcrumbSchema([
  { name: 'Accueil', url: 'https://quernel-intelligence.com/' },
  { name: 'Agents IA', url: 'https://quernel-intelligence.com/agents' },
]);

export function AgentsPage() {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Agents IA pour votre entreprise — testez-les en direct"
        description="Six agents IA métier : audit, prospection, support client, administratif, contenu, analyse. Chacun formé à votre activité, testable en direct sur notre plateforme de démonstration."
        canonical="https://quernel-intelligence.com/agents"
        jsonLd={[breadcrumbSchema]}
      />
      <div className="pt-20">
        <section className="relative bg-bg-primary overflow-hidden">
          <div className="container">
            {/* Header */}
            <motion.div
              className="mb-16 lg:mb-24"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="font-mono text-sm text-accent">001</span>
                <div className="h-px w-12 bg-accent" />
                <span className="font-mono text-xs text-text-muted tracking-wider">L'ÉQUIPE</span>
              </div>
              <h1 className="text-text-primary leading-[0.9] mb-6">
                SIX AGENTS.<br />
                <span className="text-accent">UN SEUL OBJECTIF :</span><br />
                VOS REVENUS.
              </h1>
              <p className="text-text-secondary text-lg max-w-2xl font-light">
                Chaque agent est un employé numérique formé à votre métier, sous votre contrôle.
                Ils ne remplacent personne : ils font le travail répétitif pour que vous fassiez le reste.
                <span className="text-accent"> Et vous pouvez leur parler tout de suite, en démonstration libre.</span>
              </p>
              <div className="flex flex-wrap items-center gap-6 mt-8">
                <a
                  href={DEMO_BASE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative px-8 py-4 bg-accent text-bg-primary font-semibold text-sm tracking-wide transition-all duration-300 hover:pr-12"
                >
                  <span className="relative z-10">OUVRIR LA DÉMO EN DIRECT</span>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </a>
                <span className="font-mono text-xs text-text-muted">
                  Gratuit, sans inscription — données fictives
                </span>
              </div>
            </motion.div>

            {/* Agents list */}
            <div className="space-y-0">
              {agents.map((agent, index) => (
                <motion.div
                  key={agent.slug}
                  className="group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <div className="h-px bg-border group-hover:bg-accent/30 transition-colors duration-500" />
                  <div className="grid lg:grid-cols-12 gap-6 py-10 lg:py-14">
                    {/* Index */}
                    <div className="lg:col-span-1">
                      <span className="font-mono text-sm text-text-muted group-hover:text-accent transition-colors">
                        {agent.index}
                      </span>
                    </div>

                    {/* Name & role */}
                    <div className="lg:col-span-3">
                      <h3 className="text-text-primary group-hover:text-accent transition-colors duration-300 mb-2">
                        {agent.name}
                      </h3>
                      <span className="font-mono text-xs text-text-muted tracking-wider">
                        {agent.role.toUpperCase()}
                      </span>
                    </div>

                    {/* Pitch + missions */}
                    <div className="lg:col-span-4">
                      <p className="text-text-secondary text-sm leading-relaxed mb-4">
                        {agent.pitch}
                      </p>
                      <ul className="space-y-1.5">
                        {agent.missions.map((m) => (
                          <li key={m} className="flex items-start gap-2 text-xs text-text-muted">
                            <span className="text-accent mt-px">→</span>
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Gain */}
                    <div className="lg:col-span-2">
                      <div className="p-4 border border-border group-hover:border-accent/40 transition-colors duration-300">
                        <div className="font-display text-2xl text-accent mb-1">{agent.gain}</div>
                        <div className="font-mono text-[10px] text-text-muted leading-snug">
                          {agent.gainNote.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="lg:col-span-2 flex lg:flex-col items-start lg:items-end justify-start gap-3">
                      <a
                        href={`${DEMO_BASE}/agents/${agent.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-accent hover:text-accent-hover transition-colors flex items-center gap-2"
                      >
                        <span>TESTER EN DÉMO</span>
                        <span className="w-5 h-px bg-current" />
                      </a>
                      <a
                        href="/devis"
                        className="font-mono text-xs text-text-muted hover:text-text-primary transition-colors flex items-center gap-2"
                      >
                        <span>DEMANDER UN DEVIS</span>
                        <span className="w-5 h-px bg-current" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
              <div className="h-px bg-border" />
            </div>

            {/* Bottom banner */}
            <motion.div
              className="my-20 lg:my-28 p-8 lg:p-12 border border-border relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute top-4 right-4 font-mono text-[10px] text-text-muted">002</div>
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-text-primary mb-4">
                    PAR OÙ<br /><span className="text-accent">COMMENCER ?</span>
                  </h2>
                  <p className="text-text-secondary font-light max-w-md">
                    Par l'audit. En 2 minutes, décrivez vos tâches répétitives et recevez
                    un premier rapport des gains possibles — gratuit, sans engagement.
                  </p>
                </div>
                <div className="flex lg:justify-end">
                  <button
                    onClick={() => navigate('/audit')}
                    className="group relative px-8 py-4 bg-accent text-bg-primary font-semibold text-sm tracking-wide transition-all duration-300 hover:pr-12"
                  >
                    <span className="relative z-10">LANCER MON AUDIT FLASH</span>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Background decoration */}
          <div className="absolute top-1/3 right-0 overflow-hidden pointer-events-none opacity-[0.02]">
            <span className="font-display text-[35vw] leading-none text-white">06</span>
          </div>
        </section>
      </div>
    </>
  );
}
