import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

const footerLinks: Record<string, FooterLink[]> = {
  'CRÉATION WEB': [
    { label: 'Sites vitrines', href: '/services' },
    { label: 'E-Commerce', href: '/services' },
    { label: 'Applications Web', href: '/services' },
    { label: 'Refonte', href: '/services' },
  ],
  'SOLUTIONS IA': [
    { label: 'Agents IA', href: '/services' },
    { label: 'Bots de Trading', href: '/services' },
    { label: 'Automatisation', href: '/services' },
    { label: 'IA E-Commerce', href: '/services' },
  ],
  'CONTACT': [
    { label: 'contact@quernel-intelligence.com', href: 'mailto:contact@quernel-intelligence.com', external: true },
    { label: 'Vigneux-sur-Seine (91)', href: '/contact' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-border">
      {/* Main footer */}
      <div className="container py-16 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link to="/" className="inline-block mb-6">
                <span className="font-display text-2xl text-text-primary">QUERNEL</span>
                <span className="font-display text-2xl text-accent ml-2">INTELLIGENCE</span>
              </Link>
              <p className="text-text-muted mb-6 max-w-xs">
                Sites web qui convertissent. IA qui travaille pour vous. Résultats mesurables.
              </p>
              <div className="space-y-2 font-mono text-xs text-text-muted">
                <p>SASU QUERNEL INTELLIGENCE</p>
                <p>SIRET : 995 184 876 00010</p>
                <p>91270 Vigneux-sur-Seine</p>
              </div>
            </motion.div>
          </div>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([title, links], columnIndex) => (
            <motion.div
              key={title}
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (columnIndex + 1) * 0.1 }}
            >
              <h4 className="font-mono text-xs text-text-muted tracking-wider mb-6">
                {title}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        className="text-text-secondary hover:text-accent transition-colors text-sm"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-text-secondary hover:text-accent transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Newsletter / CTA column */}
          <motion.div
            className="lg:col-span-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4 className="font-mono text-xs text-text-muted tracking-wider mb-6">
              UN PROJET EN TÊTE ?
            </h4>
            <p className="text-text-secondary text-sm mb-6">
              Parlez-nous de vos objectifs. Devis gratuit sous 24h, sans engagement.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 px-6 py-3 bg-accent text-bg-primary font-mono text-xs tracking-wider hover:bg-accent-hover transition-colors"
            >
              <span>DEMANDER UN DEVIS</span>
              <span>→</span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-mono text-xs text-text-muted">
              © 2026 Quernel Intelligence — SIRET 995 184 876 00010
            </p>
            <div className="flex items-center gap-6">
              <Link
                to="/mentions-legales"
                className="font-mono text-xs text-text-muted hover:text-accent transition-colors"
              >
                Mentions légales
              </Link>
              <span className="text-text-muted">·</span>
              <Link
                to="/confidentialite"
                className="font-mono text-xs text-text-muted hover:text-accent transition-colors"
              >
                Politique de confidentialité
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
