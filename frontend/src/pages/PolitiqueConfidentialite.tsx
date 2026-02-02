import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function PolitiqueConfidentialite() {
  return (
    <div className="pt-20 pb-24 bg-bg-primary min-h-screen">
      <div className="container max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="font-mono text-sm text-accent">RGPD</span>
            <div className="h-px w-12 bg-accent" />
          </div>
          <h1 className="text-text-primary mb-4">
            POLITIQUE DE <span className="text-accent">CONFIDENTIALITÉ</span>
          </h1>
          <p className="text-text-muted font-mono text-sm">
            Dernière mise à jour : Février 2026
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-12"
        >
          {/* Introduction */}
          <section>
            <p className="text-text-secondary text-lg">
              QUERNEL INTELLIGENCE s'engage à protéger la vie privée des utilisateurs de son site
              quernel-intelligence.com. Cette politique de confidentialité décrit comment nous
              collectons, utilisons et protégeons vos données personnelles, conformément au
              Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique
              et Libertés.
            </p>
          </section>

          {/* Section 1 - Responsable du traitement */}
          <section>
            <h2 className="text-xl text-text-primary mb-6 flex items-center gap-4">
              <span className="font-mono text-accent text-sm">01</span>
              Responsable du traitement
            </h2>
            <div className="bg-bg-secondary border border-border p-8 space-y-4">
              <div>
                <span className="font-mono text-xs text-text-muted block mb-1">RESPONSABLE</span>
                <p className="text-text-primary">SASU QUERNEL INTELLIGENCE</p>
              </div>
              <div>
                <span className="font-mono text-xs text-text-muted block mb-1">ADRESSE</span>
                <p className="text-text-primary">91270 Vigneux-sur-Seine, France</p>
              </div>
              <div>
                <span className="font-mono text-xs text-text-muted block mb-1">EMAIL DPO</span>
                <a
                  href="mailto:dpo@quernel-intelligence.com"
                  className="text-accent hover:underline"
                >
                  dpo@quernel-intelligence.com
                </a>
              </div>
            </div>
          </section>

          {/* Section 2 - Données collectées */}
          <section>
            <h2 className="text-xl text-text-primary mb-6 flex items-center gap-4">
              <span className="font-mono text-accent text-sm">02</span>
              Données collectées
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-text-primary font-medium mb-3">Données du formulaire de contact</h3>
                <ul className="space-y-2 text-text-secondary">
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">•</span>
                    <span>Nom et prénom</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">•</span>
                    <span>Adresse email</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">•</span>
                    <span>Numéro de téléphone (optionnel)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">•</span>
                    <span>Type de projet et budget estimé</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">•</span>
                    <span>Contenu du message</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-text-primary font-medium mb-3">Données de navigation (cookies)</h3>
                <ul className="space-y-2 text-text-secondary">
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">•</span>
                    <span>Adresse IP</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">•</span>
                    <span>Type de navigateur et appareil</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">•</span>
                    <span>Pages visitées et temps passé</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">•</span>
                    <span>Préférences de cookies</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 - Finalités */}
          <section>
            <h2 className="text-xl text-text-primary mb-6 flex items-center gap-4">
              <span className="font-mono text-accent text-sm">03</span>
              Finalités du traitement
            </h2>
            <div className="space-y-4 text-text-secondary">
              <p>Vos données personnelles sont collectées et traitées pour les finalités suivantes :</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span><strong className="text-text-primary">Répondre à vos demandes</strong> : traitement de vos messages envoyés via le formulaire de contact</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span><strong className="text-text-primary">Établir des devis</strong> : élaboration de propositions commerciales adaptées à vos besoins</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span><strong className="text-text-primary">Améliorer notre site</strong> : analyse statistique anonyme de la navigation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span><strong className="text-text-primary">Assurer la sécurité</strong> : protection contre les activités frauduleuses</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 - Base légale */}
          <section>
            <h2 className="text-xl text-text-primary mb-6 flex items-center gap-4">
              <span className="font-mono text-accent text-sm">04</span>
              Base légale du traitement
            </h2>
            <div className="bg-bg-secondary border border-border p-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left font-mono text-xs text-text-muted pb-4">TRAITEMENT</th>
                    <th className="text-left font-mono text-xs text-text-muted pb-4">BASE LÉGALE</th>
                  </tr>
                </thead>
                <tbody className="text-text-secondary">
                  <tr className="border-b border-border/50">
                    <td className="py-4">Formulaire de contact</td>
                    <td className="py-4 text-accent">Consentement (Art. 6.1.a RGPD)</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-4">Cookies essentiels</td>
                    <td className="py-4 text-accent">Intérêt légitime (Art. 6.1.f RGPD)</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-4">Cookies analytiques</td>
                    <td className="py-4 text-accent">Consentement (Art. 6.1.a RGPD)</td>
                  </tr>
                  <tr>
                    <td className="py-4">Exécution d'un contrat</td>
                    <td className="py-4 text-accent">Nécessité contractuelle (Art. 6.1.b RGPD)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 5 - Durée de conservation */}
          <section>
            <h2 className="text-xl text-text-primary mb-6 flex items-center gap-4">
              <span className="font-mono text-accent text-sm">05</span>
              Durée de conservation
            </h2>
            <div className="space-y-4 text-text-secondary">
              <p>Vos données sont conservées pendant les durées suivantes :</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-bg-secondary border border-border p-6">
                  <span className="font-mono text-2xl text-accent block mb-2">3 ans</span>
                  <p className="text-sm">Données de contact (prospects)</p>
                </div>
                <div className="bg-bg-secondary border border-border p-6">
                  <span className="font-mono text-2xl text-accent block mb-2">5 ans</span>
                  <p className="text-sm">Données clients (obligations comptables)</p>
                </div>
                <div className="bg-bg-secondary border border-border p-6">
                  <span className="font-mono text-2xl text-accent block mb-2">13 mois</span>
                  <p className="text-sm">Cookies et traceurs</p>
                </div>
                <div className="bg-bg-secondary border border-border p-6">
                  <span className="font-mono text-2xl text-accent block mb-2">1 an</span>
                  <p className="text-sm">Logs de sécurité</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6 - Droits des utilisateurs */}
          <section>
            <h2 className="text-xl text-text-primary mb-6 flex items-center gap-4">
              <span className="font-mono text-accent text-sm">06</span>
              Vos droits
            </h2>
            <div className="space-y-4 text-text-secondary">
              <p>
                Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits suivants :
              </p>
              <div className="grid gap-4">
                {[
                  {
                    title: 'Droit d\'accès',
                    desc: 'Obtenir la confirmation que vos données sont traitées et accéder à ces données'
                  },
                  {
                    title: 'Droit de rectification',
                    desc: 'Demander la correction de données inexactes ou incomplètes'
                  },
                  {
                    title: 'Droit à l\'effacement',
                    desc: 'Demander la suppression de vos données dans les cas prévus par la loi'
                  },
                  {
                    title: 'Droit à la limitation',
                    desc: 'Obtenir la limitation du traitement dans certaines circonstances'
                  },
                  {
                    title: 'Droit à la portabilité',
                    desc: 'Recevoir vos données dans un format structuré et lisible par machine'
                  },
                  {
                    title: 'Droit d\'opposition',
                    desc: 'Vous opposer au traitement de vos données pour des motifs légitimes'
                  },
                  {
                    title: 'Retrait du consentement',
                    desc: 'Retirer votre consentement à tout moment sans affecter la licéité du traitement antérieur'
                  },
                ].map((right, index) => (
                  <div key={index} className="flex items-start gap-4 bg-bg-secondary border border-border p-4">
                    <span className="text-accent font-mono text-lg">→</span>
                    <div>
                      <h4 className="text-text-primary font-medium mb-1">{right.title}</h4>
                      <p className="text-sm">{right.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-bg-secondary border border-accent/30 p-6 mt-6">
                <p className="text-text-primary mb-2">
                  <strong>Pour exercer vos droits :</strong>
                </p>
                <p className="text-sm">
                  Envoyez un email à <a href="mailto:dpo@quernel-intelligence.com" className="text-accent hover:underline">dpo@quernel-intelligence.com</a> en
                  joignant une copie d'un justificatif d'identité. Nous répondrons dans un délai maximum d'un mois.
                </p>
              </div>
              <p className="text-sm">
                Vous disposez également du droit d'introduire une réclamation auprès de la CNIL
                (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">www.cnil.fr</a>).
              </p>
            </div>
          </section>

          {/* Section 7 - Cookies */}
          <section>
            <h2 className="text-xl text-text-primary mb-6 flex items-center gap-4">
              <span className="font-mono text-accent text-sm">07</span>
              Cookies et traceurs
            </h2>
            <div className="space-y-6">
              <p className="text-text-secondary">
                Notre site utilise des cookies pour améliorer votre expérience de navigation.
                Un cookie est un petit fichier texte déposé sur votre terminal lors de la visite d'un site.
              </p>

              <div>
                <h3 className="text-text-primary font-medium mb-4">Types de cookies utilisés</h3>
                <div className="space-y-4">
                  <div className="bg-bg-secondary border border-border p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-text-primary font-medium">Cookies essentiels</h4>
                      <span className="font-mono text-xs text-accent bg-accent/10 px-2 py-1">OBLIGATOIRES</span>
                    </div>
                    <p className="text-text-secondary text-sm">
                      Nécessaires au fonctionnement du site. Ils permettent notamment de mémoriser
                      vos préférences de cookies et d'assurer la sécurité de la navigation.
                    </p>
                  </div>

                  <div className="bg-bg-secondary border border-border p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-text-primary font-medium">Cookies analytiques</h4>
                      <span className="font-mono text-xs text-text-muted bg-bg-primary px-2 py-1">OPTIONNELS</span>
                    </div>
                    <p className="text-text-secondary text-sm">
                      Nous permettent de mesurer l'audience du site et d'analyser la navigation
                      pour améliorer nos services. Ces données sont anonymisées.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-bg-secondary border border-accent/30 p-6">
                <p className="text-text-primary mb-2">
                  <strong>Gestion des cookies</strong>
                </p>
                <p className="text-text-secondary text-sm mb-4">
                  Vous pouvez modifier vos préférences à tout moment via le bandeau cookies
                  ou en configurant votre navigateur. Notez que le blocage de certains cookies
                  peut affecter votre expérience sur le site.
                </p>
                <button
                  onClick={() => {
                    // Reset cookie consent to show banner again
                    localStorage.removeItem('cookie-consent');
                    window.location.reload();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-accent text-accent font-mono text-xs hover:bg-accent hover:text-bg-primary transition-colors"
                >
                  GÉRER MES PRÉFÉRENCES
                </button>
              </div>
            </div>
          </section>

          {/* Section 8 - Transferts */}
          <section>
            <h2 className="text-xl text-text-primary mb-6 flex items-center gap-4">
              <span className="font-mono text-accent text-sm">08</span>
              Transferts de données
            </h2>
            <div className="space-y-4 text-text-secondary">
              <p>
                Vos données sont hébergées au sein de l'Union Européenne. En cas de transfert
                vers un pays tiers, nous nous assurons que des garanties appropriées sont mises
                en place (clauses contractuelles types, décision d'adéquation).
              </p>
              <p>
                Nous ne vendons, ne louons et ne partageons pas vos données personnelles avec
                des tiers à des fins commerciales sans votre consentement explicite.
              </p>
            </div>
          </section>

          {/* Section 9 - Sécurité */}
          <section>
            <h2 className="text-xl text-text-primary mb-6 flex items-center gap-4">
              <span className="font-mono text-accent text-sm">09</span>
              Sécurité des données
            </h2>
            <div className="space-y-4 text-text-secondary">
              <p>
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées
                pour protéger vos données personnelles contre la destruction accidentelle ou
                illicite, la perte, l'altération, la divulgation non autorisée ou l'accès non autorisé :
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>Chiffrement SSL/TLS des communications</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>Accès restreint aux données personnelles</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>Sauvegardes régulières et sécurisées</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>Mise à jour régulière des systèmes de sécurité</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 10 - Modifications */}
          <section>
            <h2 className="text-xl text-text-primary mb-6 flex items-center gap-4">
              <span className="font-mono text-accent text-sm">10</span>
              Modifications de la politique
            </h2>
            <div className="space-y-4 text-text-secondary">
              <p>
                Nous nous réservons le droit de modifier cette politique de confidentialité à
                tout moment. En cas de modification substantielle, nous vous en informerons par
                un avis visible sur notre site. Nous vous encourageons à consulter régulièrement
                cette page pour rester informé des mises à jour.
              </p>
            </div>
          </section>

          {/* Contact */}
          <div className="pt-8 border-t border-border">
            <p className="text-text-muted mb-4">
              Pour toute question concernant cette politique ou vos données personnelles :
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="mailto:dpo@quernel-intelligence.com"
                className="inline-flex items-center gap-3 px-6 py-3 bg-accent text-bg-primary font-mono text-xs tracking-wider hover:bg-accent-hover transition-colors"
              >
                <span>CONTACTER LE DPO</span>
                <span>→</span>
              </a>
              <Link
                to="/mentions-legales"
                className="inline-flex items-center gap-3 px-6 py-3 border border-border text-text-secondary font-mono text-xs tracking-wider hover:border-accent hover:text-accent transition-colors"
              >
                <span>MENTIONS LÉGALES</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
