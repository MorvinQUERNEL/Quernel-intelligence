import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlowButton } from '../ui/GlowButton';

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Solutions IA', href: '#ia-solutions' },
  { label: 'Tarifs', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0A0E1A]/90 backdrop-blur-xl border-b border-white/10'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <nav className="container-custom flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <motion.a
          href="#"
          className="flex items-center gap-2 text-xl md:text-2xl font-bold font-[var(--font-orbitron)]"
          whileHover={{ scale: 1.05 }}
        >
          <span className="gradient-text">QUERNEL</span>
          <span className="text-[#F8FAFC]">INTELLIGENCE</span>
        </motion.a>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              className="text-[#94A3B8] hover:text-[#00F0FF] transition-colors duration-300 text-sm font-medium"
              whileHover={{ y: -2 }}
            >
              {link.label}
            </motion.a>
          ))}
          <GlowButton size="sm">
            Démarrer un projet
          </GlowButton>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden relative w-10 h-10 flex items-center justify-center"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-6 flex flex-col gap-1.5">
            <motion.span
              className="block h-0.5 bg-[#00F0FF] rounded-full origin-center"
              animate={{
                rotate: isMobileMenuOpen ? 45 : 0,
                y: isMobileMenuOpen ? 8 : 0,
              }}
            />
            <motion.span
              className="block h-0.5 bg-[#00F0FF] rounded-full"
              animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
            />
            <motion.span
              className="block h-0.5 bg-[#00F0FF] rounded-full origin-center"
              animate={{
                rotate: isMobileMenuOpen ? -45 : 0,
                y: isMobileMenuOpen ? -8 : 0,
              }}
            />
          </div>
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden fixed inset-x-0 top-16 bg-[#0A0E1A]/98 backdrop-blur-xl border-b border-white/10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container-custom py-6 flex flex-col gap-4">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="text-[#94A3B8] hover:text-[#00F0FF] transition-colors duration-300 text-lg font-medium py-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              <GlowButton className="mt-4 w-full">
                Démarrer un projet
              </GlowButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
