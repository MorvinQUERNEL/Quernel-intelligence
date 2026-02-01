const footerLinks = {
  web: [
    { label: 'Sites vitrines', href: '#services' },
    { label: 'E-Commerce', href: '#services' },
    { label: 'Applications Web', href: '#services' },
    { label: 'Refonte', href: '#services' },
  ],
  ia: [
    { label: 'Agents IA', href: '#services' },
    { label: 'Bots de Trading', href: '#services' },
    { label: 'Automatisation', href: '#services' },
    { label: 'IA E-Commerce', href: '#services' },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-secondary border-t border-border">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a
              href="#"
              className="flex items-center gap-1.5 text-lg font-display font-bold mb-4"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <span className="text-text-primary">QUERNEL</span>
              <span className="text-text-secondary font-normal">INTELLIGENCE</span>
            </a>
            <p className="text-text-muted text-sm mb-4">
              Votre partenaire digital intelligent
            </p>
            <div className="text-text-muted text-xs space-y-1">
              <p>SASU QUERNEL INTELLIGENCE</p>
              <p>SIRET : 995 184 876 00010</p>
              <p>91270 Vigneux-sur-Seine</p>
            </div>
          </div>

          {/* Création Web */}
          <div>
            <h4 className="text-text-primary font-semibold text-sm mb-4">Création Web</h4>
            <ul className="space-y-2">
              {footerLinks.web.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-text-muted hover:text-text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions IA */}
          <div>
            <h4 className="text-text-primary font-semibold text-sm mb-4">Solutions IA</h4>
            <ul className="space-y-2">
              {footerLinks.ia.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-text-muted hover:text-text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-text-primary font-semibold text-sm mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:contact@quernel-intelligence.com"
                  className="text-text-muted hover:text-text-primary transition-colors text-sm"
                >
                  contact@quernel-intelligence.com
                </a>
              </li>
              <li>
                <span className="text-text-muted text-sm">Vigneux-sur-Seine (91)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-muted text-xs">
            © {currentYear} Quernel Intelligence — SIRET 995 184 876 00010
          </p>
          <div className="flex gap-4 text-text-muted text-xs">
            <a href="#" className="hover:text-text-primary transition-colors">
              Mentions légales
            </a>
            <span>·</span>
            <a href="#" className="hover:text-text-primary transition-colors">
              Politique de confidentialité
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
