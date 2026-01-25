import { LegalLayout } from "./LegalLayout"

interface TermsOfServiceProps {
  onNavigateBack: () => void
}

export function TermsOfService({ onNavigateBack }: TermsOfServiceProps) {
  return (
    <LegalLayout
      title="Conditions Générales d'Utilisation"
      lastUpdated="22 janvier 2026"
      onNavigateBack={onNavigateBack}
    >
      <p>
        Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation
        de la plateforme QUERNEL INTELLIGENCE. En utilisant nos services, vous acceptez ces conditions.
      </p>

      <h2>1. Définitions</h2>
      <ul>
        <li><strong>« Plateforme » :</strong> le site web et les services QUERNEL INTELLIGENCE accessibles à l'adresse quernel-intelligence.com</li>
        <li><strong>« Utilisateur » :</strong> toute personne physique ou morale utilisant la Plateforme</li>
        <li><strong>« Agents IA » :</strong> les assistants virtuels spécialisés proposés sur la Plateforme</li>
        <li><strong>« Contenu » :</strong> textes, données et informations générés via la Plateforme</li>
        <li><strong>« Tokens » :</strong> unité de mesure de l'utilisation des Agents IA</li>
      </ul>

      <h2>2. Éditeur</h2>
      <p>
        <strong>QUERNEL INTELLIGENCE SASU</strong><br />
        SIREN : 979632072<br />
        Siège social : France<br />
        Email : <a href="mailto:contact@quernel-intelligence.com">contact@quernel-intelligence.com</a>
      </p>

      <h2>3. Description des services</h2>
      <p>QUERNEL INTELLIGENCE propose :</p>
      <ul>
        <li><strong>3 Anges IA experts :</strong> Raphaël (Assistant Général), Gabriel (Expert Marketing), Michaël (Expert Commercial)</li>
        <li><strong>Contexte partagé</strong> entre les agents pour une synergie optimale</li>
        <li><strong>Conversations illimitées</strong> selon votre plan</li>
        <li><strong>Historique chiffré</strong> et exports de vos échanges</li>
        <li><strong>API d'intégration</strong> pour les plans Pro et supérieurs</li>
      </ul>

      <h2>4. Accès et inscription</h2>
      <h3>4.1 Conditions d'inscription</h3>
      <ul>
        <li>Être âgé d'au moins 18 ans ou avoir l'autorisation d'un représentant légal</li>
        <li>Fournir des informations exactes et complètes</li>
        <li>Disposer d'une adresse email valide</li>
        <li>Accepter les présentes CGU et notre Politique de Confidentialité</li>
      </ul>

      <h3>4.2 Compte utilisateur</h3>
      <p>
        Vous êtes responsable de la confidentialité de vos identifiants de connexion.
        Toute activité réalisée depuis votre compte est présumée être de votre fait.
        En cas de compromission, contactez-nous immédiatement.
      </p>

      <h2>5. Tarifs et paiement</h2>
      <h3>5.1 Plans disponibles</h3>
      <ul>
        <li><strong>Gratuit :</strong> 1 agent, 50 000 tokens/mois, 5 documents</li>
        <li><strong>Pro :</strong> 29€/mois - 5 agents, 500 000 tokens/mois, 50 documents</li>
        <li><strong>Business :</strong> 99€/mois - 20 agents, 2M tokens/mois, 200 documents</li>
        <li><strong>Enterprise :</strong> Sur devis - Illimité, support dédié</li>
      </ul>

      <h3>5.2 Paiement</h3>
      <p>
        Les paiements sont traités par <strong>Stripe</strong>, prestataire certifié PCI-DSS.
        Les prix sont indiqués en euros TTC. La facturation est mensuelle ou annuelle selon votre choix.
      </p>

      <h3>5.3 Essai gratuit</h3>
      <p>
        Un essai gratuit de 7 jours peut être proposé. À l'issue de cette période, votre abonnement
        sera automatiquement converti en abonnement payant, sauf annulation préalable.
      </p>

      <h2>6. Durée et résiliation</h2>
      <h3>6.1 Durée</h3>
      <p>
        L'abonnement est conclu pour une durée indéterminée avec facturation mensuelle ou annuelle.
      </p>

      <h3>6.2 Résiliation par l'Utilisateur</h3>
      <p>
        Vous pouvez résilier votre abonnement à tout moment depuis votre espace Facturation.
        Vous conserverez l'accès jusqu'à la fin de la période payée. Aucun remboursement prorata
        n'est effectué, sauf disposition légale contraire.
      </p>

      <h3>6.3 Résiliation par QUERNEL INTELLIGENCE</h3>
      <p>
        Nous nous réservons le droit de suspendre ou résilier votre compte en cas de violation
        des présentes CGU, notamment en cas d'utilisation abusive ou frauduleuse.
      </p>

      <h2>7. Utilisation acceptable</h2>
      <h3>7.1 Engagements de l'Utilisateur</h3>
      <p>Vous vous engagez à :</p>
      <ul>
        <li>Utiliser la Plateforme conformément à sa destination</li>
        <li>Ne pas utiliser les Agents IA à des fins illégales ou nuisibles</li>
        <li>Ne pas tenter de contourner les limitations techniques ou de sécurité</li>
        <li>Ne pas revendre ou redistribuer l'accès à la Plateforme</li>
        <li>Respecter les droits de propriété intellectuelle</li>
      </ul>

      <h3>7.2 Usages interdits</h3>
      <p>Il est strictement interdit d'utiliser la Plateforme pour :</p>
      <ul>
        <li>Générer du contenu illégal, haineux, diffamatoire ou discriminatoire</li>
        <li>Créer du spam ou des communications non sollicitées</li>
        <li>Usurper l'identité d'autrui</li>
        <li>Collecter des données personnelles de tiers sans consentement</li>
        <li>Perturber le fonctionnement de la Plateforme</li>
      </ul>

      <h2>8. Propriété intellectuelle</h2>
      <h3>8.1 Droits de QUERNEL INTELLIGENCE</h3>
      <p>
        La Plateforme, son code, son design, ses marques et son contenu sont la propriété exclusive
        de QUERNEL INTELLIGENCE SASU. Toute reproduction non autorisée est interdite.
      </p>

      <h3>8.2 Contenu généré</h3>
      <p>
        Vous conservez les droits sur le contenu que vous soumettez à la Plateforme.
        Les réponses générées par les Agents IA peuvent être utilisées librement dans le cadre
        de votre activité professionnelle ou personnelle.
      </p>

      <h2>9. Responsabilité</h2>
      <h3>9.1 Limitation de responsabilité</h3>
      <p>
        Les Agents IA fournissent des informations à titre indicatif. QUERNEL INTELLIGENCE ne peut
        garantir l'exactitude, l'exhaustivité ou l'actualité des réponses générées. En particulier :
      </p>
      <ul>
        <li><strong>Raphaël, Gabriel et Michaël :</strong> fournissent des informations générales et des conseils, mais ne remplacent pas des professionnels qualifiés (avocats, experts-comptables, etc.)</li>
        <li><strong>Tous les agents :</strong> les réponses doivent être vérifiées avant toute décision importante</li>
      </ul>

      <h3>9.2 Disponibilité</h3>
      <p>
        Nous nous efforçons d'assurer une disponibilité maximale de la Plateforme, sans pouvoir
        garantir une disponibilité de 100%. Des maintenances programmées peuvent occasionner
        des interruptions temporaires.
      </p>

      <h2>10. Données personnelles</h2>
      <p>
        Le traitement de vos données personnelles est régi par notre{" "}
        <a href="#privacy">Politique de Confidentialité</a>.
      </p>

      <h2>11. Modifications des CGU</h2>
      <p>
        Nous nous réservons le droit de modifier les présentes CGU. En cas de modification
        substantielle, vous serez informé par email au moins 30 jours avant l'entrée en vigueur
        des nouvelles conditions.
      </p>

      <h2>12. Droit applicable et litiges</h2>
      <p>
        Les présentes CGU sont régies par le droit français. En cas de litige, une solution
        amiable sera recherchée en priorité. À défaut, les tribunaux de Paris seront compétents.
      </p>
      <p>
        Conformément aux articles L.616-1 et R.616-1 du Code de la consommation, vous pouvez
        recourir gratuitement au service de médiation de la consommation.
      </p>

      <h2>13. Contact</h2>
      <p>
        Pour toute question concernant ces CGU :<br />
        Email : <a href="mailto:contact@quernel-intelligence.com">contact@quernel-intelligence.com</a>
      </p>
    </LegalLayout>
  )
}
