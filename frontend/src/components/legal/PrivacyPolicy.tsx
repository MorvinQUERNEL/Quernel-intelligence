import { LegalLayout } from "./LegalLayout"

interface PrivacyPolicyProps {
  onNavigateBack: () => void
}

export function PrivacyPolicy({ onNavigateBack }: PrivacyPolicyProps) {
  return (
    <LegalLayout
      title="Politique de Confidentialité"
      lastUpdated="22 janvier 2026"
      onNavigateBack={onNavigateBack}
    >
      <p>
        La présente politique de confidentialité décrit comment QUERNEL INTELLIGENCE SASU
        collecte, utilise et protège vos données personnelles conformément au Règlement Général
        sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
      </p>

      <h2>1. Responsable du traitement</h2>
      <p>
        <strong>QUERNEL INTELLIGENCE SASU</strong><br />
        SIREN : 979632072<br />
        Siège social : France<br />
        Email : <a href="mailto:contact@quernel-intelligence.com">contact@quernel-intelligence.com</a>
      </p>

      <h2>2. Données collectées</h2>
      <p>Nous collectons les données suivantes :</p>
      <ul>
        <li><strong>Données d'identification :</strong> nom, prénom, adresse email</li>
        <li><strong>Données de connexion :</strong> adresse IP, logs de connexion, horodatage</li>
        <li><strong>Données d'utilisation :</strong> historique des conversations, préférences, tokens utilisés</li>
        <li><strong>Données de paiement :</strong> traitées directement par Stripe (nous ne stockons pas vos coordonnées bancaires)</li>
      </ul>

      <h2>3. Finalités du traitement</h2>
      <p>Vos données sont utilisées pour :</p>
      <ul>
        <li>Fournir et améliorer nos services d'agents IA</li>
        <li>Gérer votre compte et votre abonnement</li>
        <li>Assurer la sécurité de la plateforme</li>
        <li>Répondre à vos demandes de support</li>
        <li>Vous envoyer des communications relatives à votre compte (avec votre consentement pour les communications marketing)</li>
        <li>Respecter nos obligations légales</li>
      </ul>

      <h2>4. Base légale</h2>
      <p>Le traitement de vos données repose sur :</p>
      <ul>
        <li><strong>L'exécution du contrat :</strong> pour fournir nos services</li>
        <li><strong>Le consentement :</strong> pour les communications marketing et les cookies non essentiels</li>
        <li><strong>L'intérêt légitime :</strong> pour améliorer nos services et assurer la sécurité</li>
        <li><strong>L'obligation légale :</strong> pour les données de facturation</li>
      </ul>

      <h2>5. Destinataires des données</h2>
      <p>Vos données peuvent être partagées avec :</p>
      <ul>
        <li><strong>Stripe :</strong> pour le traitement des paiements (certifié PCI-DSS)</li>
        <li><strong>Hostinger :</strong> pour l'hébergement de nos serveurs (basé en UE)</li>
        <li><strong>Google :</strong> pour l'authentification OAuth (si vous choisissez cette option)</li>
        <li><strong>Nos sous-traitants techniques :</strong> tous conformes au RGPD</li>
      </ul>
      <p>Nous ne vendons jamais vos données à des tiers.</p>

      <h2>6. Transferts hors UE</h2>
      <p>
        Vos données sont principalement hébergées en France et dans l'Union Européenne.
        En cas de transfert vers des pays tiers, nous nous assurons que des garanties appropriées
        sont en place (Clauses Contractuelles Types, décisions d'adéquation).
      </p>

      <h2>7. Durée de conservation</h2>
      <ul>
        <li><strong>Données de compte :</strong> pendant la durée de votre abonnement + 3 ans</li>
        <li><strong>Historique des conversations :</strong> 1 an après la dernière activité (ou sur demande de suppression)</li>
        <li><strong>Données de facturation :</strong> 10 ans (obligation légale)</li>
        <li><strong>Logs de connexion :</strong> 1 an</li>
      </ul>

      <h2>8. Vos droits</h2>
      <p>Conformément au RGPD, vous disposez des droits suivants :</p>
      <ul>
        <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
        <li><strong>Droit de rectification :</strong> corriger vos données inexactes</li>
        <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
        <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
        <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
        <li><strong>Droit à la limitation :</strong> limiter le traitement de vos données</li>
        <li><strong>Droit de retirer votre consentement :</strong> à tout moment pour les traitements basés sur le consentement</li>
      </ul>
      <p>
        Pour exercer ces droits, contactez-nous à{" "}
        <a href="mailto:dpo@quernel-intelligence.com">dpo@quernel-intelligence.com</a>
      </p>

      <h2>9. Sécurité</h2>
      <p>Nous mettons en œuvre des mesures de sécurité appropriées :</p>
      <ul>
        <li>Chiffrement des données en transit (TLS 1.3) et au repos</li>
        <li>Authentification sécurisée avec hachage des mots de passe (bcrypt)</li>
        <li>Accès restreint aux données sur la base du besoin d'en connaître</li>
        <li>Surveillance et journalisation des accès</li>
        <li>Sauvegardes régulières et plan de reprise d'activité</li>
      </ul>

      <h2>10. Cookies</h2>
      <p>
        Pour plus d'informations sur notre utilisation des cookies, consultez notre{" "}
        <a href="#cookies">Politique de Cookies</a>.
      </p>

      <h2>11. Modifications</h2>
      <p>
        Nous pouvons mettre à jour cette politique de confidentialité. En cas de modification
        significative, nous vous en informerons par email ou via une notification sur la plateforme.
      </p>

      <h2>12. Contact et réclamations</h2>
      <p>
        Pour toute question relative à la protection de vos données :<br />
        Email : <a href="mailto:dpo@quernel-intelligence.com">dpo@quernel-intelligence.com</a>
      </p>
      <p>
        Vous pouvez également introduire une réclamation auprès de la CNIL :<br />
        <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
      </p>
    </LegalLayout>
  )
}
