import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function ConditionsGeneralesVente() {
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
            <span className="font-mono text-sm text-accent">CGV</span>
            <div className="h-px w-12 bg-accent" />
          </div>
          <h1 className="text-text-primary mb-4">
            CONDITIONS GÉNÉRALES <span className="text-accent">DE VENTE</span>
          </h1>
          <p className="text-text-muted font-mono text-sm">
            Dernière mise à jour : Août 2026
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
              Les présentes conditions générales de vente régissent toutes les prestations vendues
              par QUERNEL INTELLIGENCE : création de sites web, agents IA sur mesure, workflows
              d'automatisation, audits IA et abonnements à la plateforme d'agents IA. Toute
              commande, tout devis signé et tout paiement valent acceptation de ces conditions.
            </p>
          </section>

          {/* Section 1 - Vendeur */}
          <section>
            <h2 className="text-xl text-text-primary mb-6 flex items-center gap-4">
              <span className="font-mono text-accent text-sm">01</span>
              Vendeur
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
                <span className="font-mono text-xs text-text-muted block mb-1">CONTACT</span>
                <a href="mailto:contact@quernel-intelligence.com" className="text-accent hover:underline">
                  contact@quernel-intelligence.com
                </a>
              </div>
            </div>
          </section>

          {/* Section 2 - Prestations */}
          <section>
            <h2 className="text-xl text-text-primary mb-6 flex items-center gap-4">
              <span className="font-mono text-accent text-sm">02</span>
              Prestations proposées
            </h2>
            <div className="space-y-6 text-text-secondary">
              <p>
                <span className="text-text-primary font-medium">Création web sur devis</span> —
                sites vitrines, sites e-commerce et applications web, à partir de 499 € HT. Le
                périmètre exact (nombre de pages, fonctionnalités, délais) est fixé par le devis
                accepté, qui prévaut sur toute description commerciale du site.
              </p>
              <p>
                <span className="text-text-primary font-medium">Agents IA et workflows sur mesure</span> —
                développement et intégration d'agents et d'automatisations dans les outils du client,
                sur devis.
              </p>
              <p>
                <span className="text-text-primary font-medium">Audit IA</span> — l'audit flash en
                ligne est gratuit et sans engagement. L'audit complet est facturé de 490 à 990 € HT
                selon la taille de l'entreprise, et déduit du montant du projet si un projet est
                lancé dans les trois mois.
              </p>
              <p>
                <span className="text-text-primary font-medium">Abonnement à la plateforme d'agents IA</span> —
                service en ligne accessible sur agents.quernel-cloud.com, facturé mensuellement
                selon le palier choisi. Les conditions propres à cet abonnement figurent dans les{' '}
                <a
                  href="https://agents.quernel-cloud.com/cgu"
                  className="text-accent hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CGU de la plateforme
                </a>
                {' '}et complètent les présentes CGV.
              </p>
            </div>
          </section>

          {/* Section 3 - Prix et paiement */}
          <section>
            <h2 className="text-xl text-text-primary mb-6 flex items-center gap-4">
              <span className="font-mono text-accent text-sm">03</span>
              Prix, devis et paiement
            </h2>
            <div className="space-y-6 text-text-secondary">
              <p>
                Tous les prix sont exprimés en euros et hors taxes. Les devis sont gratuits et
                valables 30 jours. Le prix indiqué au devis est ferme pour le périmètre décrit :
                toute demande hors périmètre fait l'objet d'un avenant chiffré et accepté avant
                réalisation.
              </p>
              <p>
                <span className="text-text-primary font-medium">Prestations sur devis</span> — un
                acompte de 40 % est réglé à la commande et déclenche le démarrage des travaux ; le
                solde est réglé à la livraison. Les paiements sont traités par Stripe (carte
                bancaire) via une page sécurisée, ou par virement bancaire.
              </p>
              <p>
                <span className="text-text-primary font-medium">Paiement en plusieurs fois</span> —
                pour les projets à partir de 1 000 € HT, un règlement en trois échéances sans frais
                est possible sur demande. L'échéancier est alors fixé au devis et fait partie
                intégrante de la commande.
              </p>
              <p>
                <span className="text-text-primary font-medium">Abonnement plateforme</span> —
                prélèvement mensuel automatique par Stripe à la date d'anniversaire de la
                souscription, jusqu'à résiliation par le client.
              </p>
              <p>
                <span className="text-text-primary font-medium">Retard de paiement</span> — toute
                somme non réglée à l'échéance porte intérêt au taux légal majoré, auquel s'ajoute
                l'indemnité forfaitaire de recouvrement de 40 € prévue à l'article L441-10 du Code
                de commerce.
              </p>
            </div>
          </section>

          {/* Section 4 - Annulation */}
          <section>
            <h2 className="text-xl text-text-primary mb-6 flex items-center gap-4">
              <span className="font-mono text-accent text-sm">04</span>
              Annulation
            </h2>
            <div className="space-y-6 text-text-secondary">
              <p>
                <span className="text-text-primary font-medium">Avant le démarrage des travaux</span> —
                le client peut annuler sa commande à tout moment ; l'acompte versé lui est
                intégralement remboursé sous 14 jours.
              </p>
              <p>
                <span className="text-text-primary font-medium">Après le démarrage des travaux</span> —
                l'annulation est possible à tout moment. Seuls les travaux effectivement réalisés à
                la date de l'annulation restent dus ; le reliquat de l'acompte est remboursé sous
                14 jours. Les éléments déjà produits sont remis au client.
              </p>
              <p>
                <span className="text-text-primary font-medium">Abonnement plateforme</span> —
                sans engagement de durée, résiliable à tout moment depuis l'espace « Mon compte ».
                L'accès reste ouvert jusqu'au terme de la période mensuelle déjà réglée, laquelle
                n'est pas remboursée au prorata. Aucun prélèvement n'intervient après la
                résiliation.
              </p>
            </div>
          </section>

          {/* Section 5 - Remboursement et litiges */}
          <section>
            <h2 className="text-xl text-text-primary mb-6 flex items-center gap-4">
              <span className="font-mono text-accent text-sm">05</span>
              Remboursement et litiges
            </h2>
            <div className="space-y-6 text-text-secondary">
              <p>
                Un livrable non conforme au devis accepté est corrigé sans frais. Les prestations
                sur devis incluent deux séries de révisions après la livraison, à demander dans les
                30 jours. Si, après ces révisions, la prestation reste non conforme à ce qui a été
                commandé, le client est remboursé de la part correspondante.
              </p>
              <p>
                Un service commandé et non fourni est remboursé intégralement. En revanche, une
                prestation conforme au devis et livrée n'ouvre pas droit à remboursement, et un mois
                d'abonnement entamé n'est pas remboursé.
              </p>
              <p>
                <span className="text-text-primary font-medium">Réclamation</span> — toute
                réclamation s'adresse à{' '}
                <a href="mailto:contact@quernel-intelligence.com" className="text-accent hover:underline">
                  contact@quernel-intelligence.com
                </a>
                . Une réponse est apportée sous 5 jours ouvrés et une solution amiable est
                systématiquement recherchée avant toute autre démarche. Le client est invité à nous
                contacter avant d'ouvrir un litige auprès de sa banque : une contestation bancaire
                sur une prestation livrée et conforme est traitée comme un impayé.
              </p>
              <p>
                <span className="text-text-primary font-medium">Professionnels</span> — les
                prestations sur devis s'adressent à des clients professionnels agissant dans le
                cadre de leur activité. Le droit de rétractation de 14 jours prévu par le Code de
                la consommation ne s'applique pas entre professionnels ; il reste acquis au client
                consommateur, lequel peut toutefois demander l'exécution immédiate de la prestation
                et renonce alors à ce droit pour la part exécutée.
              </p>
            </div>
          </section>

          {/* Section 6 - Obligations */}
          <section>
            <h2 className="text-xl text-text-primary mb-6 flex items-center gap-4">
              <span className="font-mono text-accent text-sm">06</span>
              Obligations et responsabilités
            </h2>
            <div className="space-y-6 text-text-secondary">
              <p>
                Le client fournit en temps utile les contenus, accès et validations nécessaires à
                la réalisation de la prestation. Un retard de sa part décale d'autant les délais
                annoncés, sans indemnité.
              </p>
              <p>
                Les livrables produits par des modèles d'intelligence artificielle constituent une
                aide à la production et à la décision, jamais un conseil juridique, comptable ou
                financier. Leur relecture et leur validation avant tout usage relèvent du client.
              </p>
              <p>
                La responsabilité de QUERNEL INTELLIGENCE, toutes causes confondues, est limitée au
                montant effectivement réglé par le client au titre de la prestation concernée. Les
                dommages indirects — perte d'exploitation, perte de chiffre d'affaires, perte de
                données non imputable à une faute prouvée — sont exclus.
              </p>
              <p>
                Les droits d'exploitation des livrables sont transférés au client au paiement
                intégral du prix. QUERNEL INTELLIGENCE conserve la propriété de ses outils,
                méthodes et composants réutilisables.
              </p>
            </div>
          </section>

          {/* Section 7 - Droit applicable */}
          <section>
            <h2 className="text-xl text-text-primary mb-6 flex items-center gap-4">
              <span className="font-mono text-accent text-sm">07</span>
              Droit applicable
            </h2>
            <div className="space-y-6 text-text-secondary">
              <p>
                Les présentes conditions sont soumises au droit français. En cas de litige, une
                solution amiable est recherchée en priorité. À défaut d'accord, le tribunal
                compétent est celui du ressort du siège social de QUERNEL INTELLIGENCE pour les
                clients professionnels, et le tribunal compétent selon les règles de droit commun
                pour les clients consommateurs.
              </p>
              <p>
                QUERNEL INTELLIGENCE se réserve le droit de modifier ces conditions. La version
                applicable est celle en vigueur à la date de la commande.
              </p>
            </div>
          </section>

          {/* Liens */}
          <section className="pt-8 border-t border-border">
            <p className="text-text-muted text-sm mb-4">Documents complémentaires :</p>
            <div className="flex flex-wrap gap-6">
              <Link to="/mentions-legales" className="font-mono text-sm text-accent hover:underline">
                MENTIONS LÉGALES →
              </Link>
              <Link to="/confidentialite" className="font-mono text-sm text-accent hover:underline">
                POLITIQUE DE CONFIDENTIALITÉ →
              </Link>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
