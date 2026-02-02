import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function MentionsLegales() {
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
            <span className="font-mono text-sm text-accent">LEGAL</span>
            <div className="h-px w-12 bg-accent" />
          </div>
          <h1 className="text-text-primary mb-4">
            MENTIONS <span className="text-accent">LÉGALES</span>
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
          {/* Section 1 - Éditeur */}
          <section>
            <h2 className="text-xl text-text-primary mb-6 flex items-center gap-4">
              <span className="font-mono text-accent text-sm">01</span>
              Éditeur du site
            </h2>
            <div className="bg-bg-secondary border border-border p-8 space-y-4">
              <div>
                <span className="font-mono text-xs text-text-muted block mb-1">RAISON SOCIALE</span>
                <p className="text-text-primary">SASU QUERNEL INTELLIGENCE</p>
              </div>
              <div>
                <span className="font-mono text-xs text-text-muted block mb-1">SIRET</span>
                <p className="text-text-primary">995 184 876 00010</p>
              </div>
              <div>
                <span className="font-mono text-xs text-text-muted block mb-1">SIÈGE SOCIAL</span>
                <p className="text-text-primary">91270 Vigneux-sur-Seine, France</p>
              </div>
              <div>
                <span className="font-mono text-xs text-text-muted block mb-1">CAPITAL SOCIAL</span>
                <p className="text-text-primary">1 000 €</p>
              </div>
              <div>
                <span className="font-mono text-xs text-text-muted block mb-1">EMAIL</span>
                <a
                  href="mailto:contact@quernel-intelligence.com"
                  className="text-accent hover:underline"
                >
                  contact@quernel-intelligence.com
                </a>
              </div>
              <div>
                <span className="font-mono text-xs text-text-muted block mb-1">DIRECTEUR DE LA PUBLICATION</span>
                <p className="text-text-primary">Le représentant légal de la société QUERNEL INTELLIGENCE</p>
              </div>
            </div>
          </section>

          {/* Section 2 - Hébergeur */}
          <section>
            <h2 className="text-xl text-text-primary mb-6 flex items-center gap-4">
              <span className="font-mono text-accent text-sm">02</span>
              Hébergeur
            </h2>
            <div className="bg-bg-secondary border border-border p-8 space-y-4">
              <div>
                <span className="font-mono text-xs text-text-muted block mb-1">SOCIÉTÉ</span>
                <p className="text-text-primary">Hostinger International Ltd</p>
              </div>
              <div>
                <span className="font-mono text-xs text-text-muted block mb-1">ADRESSE</span>
                <p className="text-text-primary">61 Lordou Vironos Street, 6023 Larnaca, Chypre</p>
              </div>
              <div>
                <span className="font-mono text-xs text-text-muted block mb-1">SITE WEB</span>
                <a
                  href="https://www.hostinger.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  www.hostinger.fr
                </a>
              </div>
            </div>
          </section>

          {/* Section 3 - Propriété intellectuelle */}
          <section>
            <h2 className="text-xl text-text-primary mb-6 flex items-center gap-4">
              <span className="font-mono text-accent text-sm">03</span>
              Propriété intellectuelle
            </h2>
            <div className="space-y-4 text-text-secondary">
              <p>
                L'ensemble du contenu présent sur le site quernel-intelligence.com, incluant, de façon
                non limitative, les textes, graphismes, images, logos, icônes, sons, logiciels, est la
                propriété exclusive de QUERNEL INTELLIGENCE ou de ses partenaires et est protégé par
                les lois françaises et internationales relatives à la propriété intellectuelle.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication, adaptation de tout ou
                partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite,
                sauf autorisation écrite préalable de QUERNEL INTELLIGENCE.
              </p>
              <p>
                Toute exploitation non autorisée du site ou de l'un quelconque des éléments qu'il contient
                sera considérée comme constitutive d'une contrefaçon et poursuivie conformément aux
                dispositions des articles L.335-2 et suivants du Code de la Propriété Intellectuelle.
              </p>
            </div>
          </section>

          {/* Section 4 - Limitation de responsabilité */}
          <section>
            <h2 className="text-xl text-text-primary mb-6 flex items-center gap-4">
              <span className="font-mono text-accent text-sm">04</span>
              Limitation de responsabilité
            </h2>
            <div className="space-y-4 text-text-secondary">
              <p>
                QUERNEL INTELLIGENCE ne pourra être tenue responsable des dommages directs et indirects
                causés au matériel de l'utilisateur, lors de l'accès au site quernel-intelligence.com,
                et résultant soit de l'utilisation d'un matériel ne répondant pas aux spécifications
                techniques requises, soit de l'apparition d'un bug ou d'une incompatibilité.
              </p>
              <p>
                QUERNEL INTELLIGENCE ne pourra également être tenue responsable des dommages indirects
                (tels par exemple qu'une perte de marché ou perte d'une chance) consécutifs à l'utilisation
                du site quernel-intelligence.com.
              </p>
              <p>
                Des espaces interactifs (formulaire de contact) sont à la disposition des utilisateurs.
                QUERNEL INTELLIGENCE se réserve le droit de supprimer, sans mise en demeure préalable,
                tout contenu déposé dans cet espace qui contreviendrait à la législation applicable en
                France, en particulier aux dispositions relatives à la protection des données.
              </p>
              <p>
                Le cas échéant, QUERNEL INTELLIGENCE se réserve également la possibilité de mettre en
                cause la responsabilité civile et/ou pénale de l'utilisateur, notamment en cas de message
                à caractère raciste, injurieux, diffamant, ou pornographique, quel que soit le support
                utilisé (texte, photographie…).
              </p>
            </div>
          </section>

          {/* Section 5 - Liens hypertextes */}
          <section>
            <h2 className="text-xl text-text-primary mb-6 flex items-center gap-4">
              <span className="font-mono text-accent text-sm">05</span>
              Liens hypertextes
            </h2>
            <div className="space-y-4 text-text-secondary">
              <p>
                Le site quernel-intelligence.com peut contenir des liens hypertextes vers d'autres sites
                présents sur le réseau Internet. Les liens vers ces autres ressources vous font quitter
                le site quernel-intelligence.com.
              </p>
              <p>
                Il est possible de créer un lien vers la page de présentation de ce site sans autorisation
                expresse de QUERNEL INTELLIGENCE. Aucune autorisation ou demande d'information préalable
                ne peut être exigée par l'éditeur à l'égard d'un site qui souhaite établir un lien vers
                le site de l'éditeur. Il convient toutefois d'afficher ce site dans une nouvelle fenêtre
                du navigateur. Cependant, QUERNEL INTELLIGENCE se réserve le droit de demander la
                suppression d'un lien qu'elle estime non conforme à l'objet du site quernel-intelligence.com.
              </p>
            </div>
          </section>

          {/* Section 6 - Droit applicable */}
          <section>
            <h2 className="text-xl text-text-primary mb-6 flex items-center gap-4">
              <span className="font-mono text-accent text-sm">06</span>
              Droit applicable et juridiction
            </h2>
            <div className="space-y-4 text-text-secondary">
              <p>
                Les présentes mentions légales sont régies par le droit français. En cas de litige,
                les tribunaux français seront seuls compétents.
              </p>
              <p>
                Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter
                à l'adresse : <a href="mailto:contact@quernel-intelligence.com" className="text-accent hover:underline">contact@quernel-intelligence.com</a>
              </p>
            </div>
          </section>

          {/* Link to privacy policy */}
          <div className="pt-8 border-t border-border">
            <p className="text-text-muted mb-4">
              Pour en savoir plus sur la gestion de vos données personnelles :
            </p>
            <Link
              to="/confidentialite"
              className="inline-flex items-center gap-3 px-6 py-3 bg-accent text-bg-primary font-mono text-xs tracking-wider hover:bg-accent-hover transition-colors"
            >
              <span>POLITIQUE DE CONFIDENTIALITÉ</span>
              <span>→</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
