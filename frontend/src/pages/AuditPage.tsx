import { useState } from 'react';
import { motion } from 'framer-motion';
import { SEO, createBreadcrumbSchema } from '../components/seo';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

const secteurs = [
  { value: '', label: 'Sélectionner...' },
  { value: 'artisanat-btp', label: 'Artisanat / BTP' },
  { value: 'commerce', label: 'Commerce / E-commerce' },
  { value: 'services-b2b', label: 'Services aux entreprises' },
  { value: 'sante-bien-etre', label: 'Santé / Bien-être' },
  { value: 'restauration-hotellerie', label: 'Restauration / Hôtellerie' },
  { value: 'immobilier', label: 'Immobilier' },
  { value: 'industrie', label: 'Industrie' },
  { value: 'autre', label: 'Autre' },
];

const tailles = [
  { value: '', label: 'Sélectionner...' },
  { value: 'solo', label: 'Indépendant / solo' },
  { value: '2-10', label: '2 à 10 personnes' },
  { value: '11-50', label: '11 à 50 personnes' },
  { value: '50+', label: 'Plus de 50 personnes' },
];

const objectifs = [
  { value: '', label: 'Sélectionner...' },
  { value: 'gagner-temps', label: 'Gagner du temps' },
  { value: 'vendre-plus', label: 'Vendre plus' },
  { value: 'reduire-couts', label: 'Réduire les coûts' },
  { value: 'mieux-servir', label: 'Mieux servir mes clients' },
];

const breadcrumbSchema = createBreadcrumbSchema([
  { name: 'Accueil', url: 'https://quernel-intelligence.com/' },
  { name: 'Audit IA', url: 'https://quernel-intelligence.com/audit' },
]);

export function AuditPage() {
  const [formData, setFormData] = useState({
    entreprise: '',
    email: '',
    secteur: '',
    taille: '',
    objectif: '',
    taches: '',
    outils: '',
  });
  const [status, setStatus] = useState<FormStatus>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch('/api/audit-send.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const inputClasses = `
    w-full px-0 py-4 bg-transparent border-0 border-b border-border
    text-text-primary placeholder:text-text-muted
    focus:outline-none focus:border-accent
    transition-colors duration-300
    font-light
  `;

  const selectClasses = `
    w-full px-0 py-4 bg-transparent border-0 border-b border-border
    text-text-primary
    focus:outline-none focus:border-accent
    transition-colors duration-300
    font-light appearance-none cursor-pointer
  `;

  return (
    <>
      <SEO
        title="Audit IA — sachez ce que l'IA peut vous rapporter"
        description="Audit flash gratuit en 2 minutes : décrivez vos tâches répétitives, recevez un rapport des gains IA possibles. Audit complet de 490 à 990 € : cartographie, chiffrage, plan de mise en œuvre."
        canonical="https://quernel-intelligence.com/audit"
        jsonLd={[breadcrumbSchema]}
      />
      <div className="pt-20">
        <section className="relative bg-bg-primary overflow-hidden">
          <div className="container">
            {/* Header */}
            <motion.div
              className="mb-16 lg:mb-20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="font-mono text-sm text-accent">001</span>
                <div className="h-px w-12 bg-accent" />
                <span className="font-mono text-xs text-text-muted tracking-wider">AUDIT IA</span>
              </div>
              <h1 className="text-text-primary leading-[0.9] mb-6">
                AVANT D'INVESTIR,<br />
                <span className="text-accent">MESUREZ.</span>
              </h1>
              <p className="text-text-secondary text-lg max-w-2xl font-light">
                L'IA n'est pas magique : elle rapporte quand elle est posée au bon endroit.
                L'audit sert à trouver cet endroit dans votre entreprise —
                <span className="text-accent"> avec des chiffres en fourchettes honnêtes, pas des promesses.</span>
              </p>
            </motion.div>

            {/* Two levels */}
            <div className="grid lg:grid-cols-2 gap-8 mb-20 lg:mb-28">
              {[
                {
                  index: '01',
                  name: 'AUDIT FLASH',
                  price: 'GRATUIT',
                  desc: 'Le formulaire ci-dessous. Vous décrivez vos tâches répétitives, vous recevez par email un premier rapport : les gains possibles par processus, en ordre de grandeur.',
                  features: ['2 minutes de formulaire', 'Rapport PDF par email', 'Gains estimés par processus', 'Sans engagement'],
                  highlighted: true,
                },
                {
                  index: '02',
                  name: 'AUDIT COMPLET',
                  price: '490-990€',
                  desc: 'Une demi-journée avec vous et votre équipe. On chronomètre les vrais processus, on chiffre chaque opportunité avec ses hypothèses, on priorise, et on repart avec un plan.',
                  features: ['Cartographie sur site ou en visio', 'Top 3 des opportunités chiffrées', 'Plan de mise en œuvre priorisé', 'Montant déduit si projet lancé'],
                  highlighted: false,
                },
              ].map((level, i) => (
                <motion.div
                  key={level.index}
                  className={`relative p-8 lg:p-10 border transition-colors duration-300 ${
                    level.highlighted ? 'border-accent/60' : 'border-border hover:border-accent/30'
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="absolute top-4 right-4 font-mono text-[10px] text-text-muted">{level.index}</div>
                  <div className="font-mono text-xs text-text-muted tracking-wider mb-2">NIVEAU {level.index}</div>
                  <h3 className="text-text-primary mb-1">{level.name}</h3>
                  <div className="font-display text-3xl text-accent mb-6">{level.price}</div>
                  <p className="text-text-secondary text-sm leading-relaxed mb-6">{level.desc}</p>
                  <ul className="space-y-2">
                    {level.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-text-muted">
                        <span className="text-accent mt-px">→</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Flash form */}
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 pb-24">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-mono text-sm text-accent">002</span>
                  <div className="h-px w-12 bg-accent" />
                  <span className="font-mono text-xs text-text-muted tracking-wider">AUDIT FLASH</span>
                </div>
                <h2 className="text-text-primary mb-8">
                  2 MINUTES.<br />
                  <span className="text-accent">C'EST PARTI.</span>
                </h2>
                <p className="text-text-secondary text-lg mb-8 max-w-md">
                  Plus vous êtes précis sur vos tâches répétitives, plus le rapport est utile.
                  Vous le recevez par email, en général dans la journée.
                </p>
                <div className="p-6 border border-border font-mono text-xs text-text-muted space-y-2">
                  <div className="text-accent">// Exemple de ce qu'on identifie</div>
                  <div>devis : 45 min → 15 min</div>
                  <div>relances impayés : 2 h/sem → 20 min/sem</div>
                  <div>tri des emails : 1 h/jour → 15 min/jour</div>
                  <div className="text-text-muted/60">chiffres mesurés chez un client type — les vôtres dépendront de l'audit</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {status === 'success' ? (
                  <div className="p-8 border border-accent/60">
                    <div className="font-mono text-sm text-accent mb-4">✓ DEMANDE ENVOYÉE</div>
                    <p className="text-text-secondary">
                      Merci ! Votre audit flash est en préparation. Vous recevrez le rapport
                      par email — pensez à vérifier vos courriers indésirables.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="font-mono text-xs text-text-muted tracking-wider">ENTREPRISE *</label>
                        <input
                          type="text"
                          name="entreprise"
                          value={formData.entreprise}
                          onChange={handleChange}
                          required
                          placeholder="Nom de votre entreprise"
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label className="font-mono text-xs text-text-muted tracking-wider">EMAIL *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="vous@entreprise.fr"
                          className={inputClasses}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="font-mono text-xs text-text-muted tracking-wider">SECTEUR *</label>
                        <select name="secteur" value={formData.secteur} onChange={handleChange} required className={selectClasses}>
                          {secteurs.map((s) => (
                            <option key={s.value} value={s.value} className="bg-bg-primary">{s.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="font-mono text-xs text-text-muted tracking-wider">TAILLE *</label>
                        <select name="taille" value={formData.taille} onChange={handleChange} required className={selectClasses}>
                          {tailles.map((t) => (
                            <option key={t.value} value={t.value} className="bg-bg-primary">{t.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="font-mono text-xs text-text-muted tracking-wider">OBJECTIF PRIORITAIRE *</label>
                      <select name="objectif" value={formData.objectif} onChange={handleChange} required className={selectClasses}>
                        {objectifs.map((o) => (
                          <option key={o.value} value={o.value} className="bg-bg-primary">{o.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-mono text-xs text-text-muted tracking-wider">VOS TÂCHES RÉPÉTITIVES *</label>
                      <textarea
                        name="taches"
                        value={formData.taches}
                        onChange={handleChange}
                        required
                        rows={4}
                        placeholder="Ex. : je passe mes soirées sur les devis, je relance mes impayés à la main, je réponds 20 fois par semaine aux mêmes questions..."
                        className={inputClasses}
                      />
                    </div>

                    <div>
                      <label className="font-mono text-xs text-text-muted tracking-wider">VOS OUTILS ACTUELS</label>
                      <input
                        type="text"
                        name="outils"
                        value={formData.outils}
                        onChange={handleChange}
                        placeholder="Ex. : Excel, Gmail, un logiciel de facturation..."
                        className={inputClasses}
                      />
                    </div>

                    {status === 'error' && (
                      <p className="font-mono text-xs text-red-400">
                        Une erreur est survenue. Réessayez, ou écrivez-nous : contact@quernel-intelligence.com
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="group relative px-8 py-4 bg-accent text-bg-primary font-semibold text-sm tracking-wide transition-all duration-300 hover:pr-12 disabled:opacity-50 disabled:cursor-wait"
                    >
                      <span className="relative z-10">
                        {status === 'loading' ? 'ENVOI EN COURS...' : 'RECEVOIR MON AUDIT FLASH'}
                      </span>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </button>

                    <p className="font-mono text-[10px] text-text-muted leading-relaxed">
                      Vos réponses servent uniquement à produire votre rapport et à vous recontacter à ce sujet.
                      Pas de newsletter, pas de revente de données.
                    </p>
                  </form>
                )}
              </motion.div>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute bottom-0 right-0 overflow-hidden pointer-events-none opacity-[0.02]">
            <span className="font-display text-[30vw] leading-none text-white">IA</span>
          </div>
        </section>
      </div>
    </>
  );
}
