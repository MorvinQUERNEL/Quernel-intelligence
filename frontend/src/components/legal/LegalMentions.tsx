import { LegalLayout } from "./LegalLayout"

interface LegalMentionsProps {
  onNavigateBack: () => void
}

export function LegalMentions({ onNavigateBack }: LegalMentionsProps) {
  return (
    <LegalLayout
      title="Mentions Légales"
      lastUpdated="22 janvier 2026"
      onNavigateBack={onNavigateBack}
    >
      <h2>1. Éditeur du site</h2>
      <p>
        Le site quernel-intelligence.com est édité par :
      </p>
      <ul>
        <li><strong>Raison sociale :</strong> QUERNEL INTELLIGENCE</li>
        <li><strong>Forme juridique :</strong> Société par Actions Simplifiée Unipersonnelle (SASU)</li>
        <li><strong>Capital social :</strong> À définir</li>
        <li><strong>SIREN :</strong> 979632072</li>
        <li><strong>Siège social :</strong> France</li>
        <li><strong>Adresse email :</strong> <a href="mailto:contact@quernel-intelligence.com">contact@quernel-intelligence.com</a></li>
      </ul>

      <h2>2. Directeur de la publication</h2>
      <p>
        Le directeur de la publication est le représentant légal de la société QUERNEL INTELLIGENCE SASU.
      </p>

      <h2>3. Hébergement</h2>
      <p>
        Le site est hébergé par :
      </p>
      <ul>
        <li><strong>Hébergeur :</strong> Hostinger International Ltd</li>
        <li><strong>Adresse :</strong> 61 Lordou Vironos Street, 6023 Larnaca, Chypre</li>
        <li><strong>Site web :</strong> <a href="https://www.hostinger.fr" target="_blank" rel="noopener noreferrer">www.hostinger.fr</a></li>
      </ul>
      <p>
        Les serveurs sont situés dans l'Union Européenne, garantissant la conformité avec le RGPD.
      </p>

      <h2>4. Propriété intellectuelle</h2>
      <p>
        L'ensemble des éléments constituant le site quernel-intelligence.com (textes, graphismes,
        logiciels, photographies, images, sons, vidéos, plans, noms, logos, marques, créations
        et œuvres protégeables diverses, bases de données, etc.) ainsi que le site lui-même,
        sont la propriété exclusive de QUERNEL INTELLIGENCE SASU ou de ses partenaires.
      </p>
      <p>
        Ces éléments sont protégés par les lois françaises et internationales relatives à la
        propriété intellectuelle. Toute reproduction, représentation, modification, publication,
        adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé
        utilisé, est interdite, sauf autorisation écrite préalable de QUERNEL INTELLIGENCE SASU.
      </p>
      <p>
        La marque « QUERNEL INTELLIGENCE » et le logo associé sont des marques déposées.
        Toute utilisation non autorisée constitue une contrefaçon passible de sanctions pénales.
      </p>

      <h2>5. Données personnelles</h2>
      <p>
        Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi
        « Informatique et Libertés », vous disposez de droits concernant vos données personnelles.
      </p>
      <p>
        Pour plus d'informations, consultez notre <a href="#privacy">Politique de Confidentialité</a>.
      </p>
      <p>
        <strong>Délégué à la protection des données :</strong><br />
        Email : <a href="mailto:dpo@quernel-intelligence.com">dpo@quernel-intelligence.com</a>
      </p>

      <h2>6. Cookies</h2>
      <p>
        Le site utilise des cookies pour améliorer l'expérience utilisateur et mesurer l'audience.
        Pour plus d'informations, consultez notre <a href="#cookies">Politique de Cookies</a>.
      </p>

      <h2>7. Limitations de responsabilité</h2>
      <p>
        QUERNEL INTELLIGENCE SASU s'efforce d'assurer l'exactitude et la mise à jour des
        informations diffusées sur ce site, dont elle se réserve le droit de corriger, à tout
        moment et sans préavis, le contenu.
      </p>
      <p>
        Toutefois, QUERNEL INTELLIGENCE SASU ne peut garantir l'exactitude, la précision ou
        l'exhaustivité des informations mises à disposition sur ce site.
      </p>
      <p>
        En conséquence, QUERNEL INTELLIGENCE SASU décline toute responsabilité :
      </p>
      <ul>
        <li>Pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur le site</li>
        <li>Pour tous dommages résultant d'une intrusion frauduleuse d'un tiers ayant entraîné une modification des informations</li>
        <li>Et plus généralement, pour tous dommages, directs ou indirects, qu'elles qu'en soient les causes, origines, natures ou conséquences</li>
      </ul>

      <h2>8. Liens hypertextes</h2>
      <p>
        Le site peut contenir des liens hypertextes vers d'autres sites. QUERNEL INTELLIGENCE
        SASU n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur
        contenu ou à leur politique de confidentialité.
      </p>

      <h2>9. Droit applicable</h2>
      <p>
        Les présentes mentions légales sont régies par le droit français. En cas de litige,
        et après échec de toute tentative de recherche d'une solution amiable, les tribunaux
        français seront seuls compétents.
      </p>

      <h2>10. Contact</h2>
      <p>
        Pour toute question ou demande d'information concernant le site, vous pouvez nous contacter :
      </p>
      <ul>
        <li><strong>Email :</strong> <a href="mailto:contact@quernel-intelligence.com">contact@quernel-intelligence.com</a></li>
      </ul>

      <h2>11. Crédits</h2>
      <p>
        <strong>Conception et développement :</strong> QUERNEL INTELLIGENCE SASU<br />
        <strong>Design :</strong> QUERNEL INTELLIGENCE SASU<br />
        <strong>Icônes :</strong> Lucide Icons
      </p>
    </LegalLayout>
  )
}
