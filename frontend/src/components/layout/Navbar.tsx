import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/services', label: 'Services' },
  { href: '/tarifs', label: 'Tarifs' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <motion.header
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-500
          ${isScrolled ? 'bg-bg-primary/90 backdrop-blur-md border-b border-border' : 'bg-transparent'}
        `}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <nav className="container flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-display text-xl text-text-primary group-hover:text-accent transition-colors">
              QUERNEL
            </span>
            <span className="font-display text-xl text-accent">
              INTELLIGENCE
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-12">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`
                  font-mono text-xs tracking-wider transition-colors
                  ${location.pathname === link.href
                    ? 'text-accent'
                    : 'text-text-muted hover:text-accent'}
                `}
              >
                {link.label.toUpperCase()}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:block">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 px-6 py-3 border border-accent text-accent font-mono text-xs tracking-wider hover:bg-accent hover:text-bg-primary transition-all duration-300"
            >
              <span>DÉMARRER</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <motion.span
              className="w-6 h-px bg-text-primary"
              animate={{
                rotate: isMobileMenuOpen ? 45 : 0,
                y: isMobileMenuOpen ? 4 : 0,
              }}
            />
            <motion.span
              className="w-6 h-px bg-text-primary"
              animate={{
                opacity: isMobileMenuOpen ? 0 : 1,
              }}
            />
            <motion.span
              className="w-6 h-px bg-text-primary"
              animate={{
                rotate: isMobileMenuOpen ? -45 : 0,
                y: isMobileMenuOpen ? -4 : 0,
              }}
            />
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-bg-primary lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container pt-24 pb-12 h-full flex flex-col">
              <nav className="flex-1 flex flex-col justify-center gap-8">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      to={link.href}
                      className={`
                        font-display text-4xl transition-colors
                        ${location.pathname === link.href
                          ? 'text-accent'
                          : 'text-text-primary hover:text-accent'}
                      `}
                    >
                      {link.label.toUpperCase()}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Link
                  to="/contact"
                  className="block w-full py-5 bg-accent text-bg-primary text-center font-mono text-sm tracking-wider"
                >
                  DÉMARRER UN PROJET
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
