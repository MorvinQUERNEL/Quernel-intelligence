import { LegalLayout } from "./LegalLayout"

interface CookiePolicyProps {
  onNavigateBack: () => void
}

export function CookiePolicy({ onNavigateBack }: CookiePolicyProps) {
  return (
    <LegalLayout
      title="Politique de Cookies"
      lastUpdated="22 janvier 2026"
      onNavigateBack={onNavigateBack}
    >
      <p>
        Cette politique explique comment QUERNEL INTELLIGENCE utilise les cookies et technologies
        similaires sur notre plateforme, conformément à la directive ePrivacy et au RGPD.
      </p>

      <h2>1. Qu'est-ce qu'un cookie ?</h2>
      <p>
        Un cookie est un petit fichier texte déposé sur votre appareil (ordinateur, smartphone,
        tablette) lors de votre visite sur notre site. Les cookies permettent de reconnaître
        votre appareil et de mémoriser certaines informations sur votre visite.
      </p>

      <h2>2. Types de cookies utilisés</h2>

      <h3>2.1 Cookies strictement nécessaires</h3>
      <p>
        Ces cookies sont essentiels au fonctionnement de la plateforme. Sans eux, vous ne pourriez
        pas utiliser nos services. Ils ne peuvent pas être désactivés.
      </p>
      <table className="w-full my-4">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Nom</th>
            <th className="text-left py-2">Finalité</th>
            <th className="text-left py-2">Durée</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-2">quernel-auth</td>
            <td className="py-2">Authentification et session utilisateur</td>
            <td className="py-2">7 jours</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">quernel-csrf</td>
            <td className="py-2">Protection contre les attaques CSRF</td>
            <td className="py-2">Session</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">cookie-consent</td>
            <td className="py-2">Mémorisation de vos préférences cookies</td>
            <td className="py-2">1 an</td>
          </tr>
        </tbody>
      </table>

      <h3>2.2 Cookies fonctionnels</h3>
      <p>
        Ces cookies permettent d'améliorer votre expérience en mémorisant vos préférences
        (langue, thème sombre/clair, etc.).
      </p>
      <table className="w-full my-4">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Nom</th>
            <th className="text-left py-2">Finalité</th>
            <th className="text-left py-2">Durée</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-2">quernel-theme</td>
            <td className="py-2">Préférence de thème (clair/sombre)</td>
            <td className="py-2">1 an</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">quernel-lang</td>
            <td className="py-2">Préférence de langue</td>
            <td className="py-2">1 an</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">quernel-sidebar</td>
            <td className="py-2">État du menu latéral (ouvert/fermé)</td>
            <td className="py-2">30 jours</td>
          </tr>
        </tbody>
      </table>

      <h3>2.3 Cookies analytiques (optionnels)</h3>
      <p>
        Ces cookies nous aident à comprendre comment les visiteurs utilisent notre site
        (pages visitées, temps passé, etc.). Ces données sont anonymisées.
      </p>
      <table className="w-full my-4">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Nom</th>
            <th className="text-left py-2">Finalité</th>
            <th className="text-left py-2">Durée</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-2">_ga</td>
            <td className="py-2">Google Analytics - identification visiteur</td>
            <td className="py-2">2 ans</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">_gid</td>
            <td className="py-2">Google Analytics - session</td>
            <td className="py-2">24 heures</td>
          </tr>
        </tbody>
      </table>
      <p>
        <strong>Note :</strong> Les cookies analytiques ne sont déposés qu'avec votre consentement
        explicite.
      </p>

      <h2>3. Base légale</h2>
      <ul>
        <li><strong>Cookies essentiels :</strong> Intérêt légitime (fonctionnement du service)</li>
        <li><strong>Cookies fonctionnels :</strong> Intérêt légitime (amélioration de l'expérience)</li>
        <li><strong>Cookies analytiques :</strong> Consentement</li>
      </ul>

      <h2>4. Gestion de vos préférences</h2>
      <h3>4.1 Via notre bandeau de consentement</h3>
      <p>
        Lors de votre première visite, un bandeau vous permet d'accepter ou refuser les cookies
        non essentiels. Vous pouvez modifier vos choix à tout moment en cliquant sur
        « Paramètres des cookies » en bas de page.
      </p>

      <h3>4.2 Via votre navigateur</h3>
      <p>
        Vous pouvez également configurer votre navigateur pour bloquer les cookies :
      </p>
      <ul>
        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
        <li><a href="https://support.mozilla.org/fr/kb/protection-renforcee-contre-pistage-firefox-ordinateur" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
        <li><a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
        <li><a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
      </ul>
      <p>
        <strong>Attention :</strong> Le blocage de tous les cookies peut affecter le fonctionnement
        de certaines fonctionnalités de notre plateforme.
      </p>

      <h2>5. Cookies tiers</h2>
      <p>Certains cookies peuvent être déposés par nos partenaires :</p>
      <ul>
        <li>
          <strong>Stripe :</strong> Pour le traitement sécurisé des paiements
          (<a href="https://stripe.com/fr/privacy" target="_blank" rel="noopener noreferrer">Politique de confidentialité Stripe</a>)
        </li>
        <li>
          <strong>Google :</strong> Pour l'authentification OAuth et les analytics
          (<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Politique de confidentialité Google</a>)
        </li>
      </ul>

      <h2>6. Durée de conservation</h2>
      <p>
        Les cookies ont des durées de vie différentes selon leur finalité :
      </p>
      <ul>
        <li><strong>Cookies de session :</strong> Supprimés à la fermeture du navigateur</li>
        <li><strong>Cookies persistants :</strong> De 24 heures à 2 ans maximum selon le cookie</li>
      </ul>

      <h2>7. Vos droits</h2>
      <p>
        Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression
        de vos données. Pour exercer ces droits, contactez-nous à{" "}
        <a href="mailto:dpo@quernel-intelligence.com">dpo@quernel-intelligence.com</a>.
      </p>

      <h2>8. Modifications</h2>
      <p>
        Nous pouvons mettre à jour cette politique de cookies. La date de dernière mise à jour
        est indiquée en haut de cette page.
      </p>

      <h2>9. Contact</h2>
      <p>
        Pour toute question concernant notre utilisation des cookies :<br />
        Email : <a href="mailto:contact@quernel-intelligence.com">contact@quernel-intelligence.com</a>
      </p>
    </LegalLayout>
  )
}
