import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-bg-primary">
      {/* Cursor glow effect */}
      <div
        className="cursor-glow hidden lg:block"
        style={{ left: mousePos.x, top: mousePos.y }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(56, 189, 248, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56, 189, 248, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }} />
      </div>

      {/* Vertical text decoration - Left */}
      <motion.div
        className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="w-px h-20 bg-gradient-to-b from-transparent via-accent to-transparent" />
        <span className="text-vertical font-mono text-xs tracking-[0.3em] text-text-muted">
          QUERNEL/INTELLIGENCE
        </span>
        <div className="w-px h-20 bg-gradient-to-b from-transparent via-border to-transparent" />
      </motion.div>

      {/* Main content */}
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-center min-h-[80vh]">
          {/* Left - Giant Typography */}
          <div className="lg:col-span-7 relative">
            {/* Index number */}
            <motion.div
              className="flex items-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="font-mono text-sm text-accent">001</span>
              <div className="h-px w-12 bg-accent" />
              <span className="font-mono text-xs text-text-muted tracking-wider">DIGITAL AGENCY</span>
            </motion.div>

            {/* Main title - Massive */}
            <motion.div
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-text-primary leading-[0.85]">
                <motion.span
                  className="block"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  VOTRE
                </motion.span>
                <motion.span
                  className="block text-accent"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  CROISSANCE
                </motion.span>
                <motion.span
                  className="block"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  DIGITALE
                </motion.span>
              </h1>

              {/* Decorative line */}
              <motion.div
                className="absolute -left-8 top-0 w-1 h-full bg-gradient-to-b from-accent via-accent/50 to-transparent hidden lg:block"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                style={{ transformOrigin: 'top' }}
              />
            </motion.div>

            {/* Subtitle */}
            <motion.p
              className="text-lg md:text-xl text-text-secondary mt-8 max-w-lg font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              Gagnez du temps. Générez plus de clients. Automatisez l'essentiel.
              <span className="text-accent"> Nous créons les outils digitaux qui font grandir votre entreprise.</span>
            </motion.p>

            {/* CTA */}
            <motion.div
              className="flex flex-wrap items-center gap-6 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <button
                onClick={() => navigate('/contact')}
                className="group relative px-8 py-4 bg-accent text-bg-primary font-semibold text-sm tracking-wide overflow-hidden transition-all duration-300 hover:pr-12"
              >
                <span className="relative z-10">OBTENIR MON DEVIS GRATUIT</span>
                <motion.span
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  →
                </motion.span>
              </button>

              <button
                onClick={() => navigate('/services')}
                className="group flex items-center gap-3 text-text-secondary hover:text-accent transition-colors"
              >
                <span className="font-mono text-sm">DÉCOUVRIR NOS SERVICES</span>
                <span className="w-8 h-px bg-current group-hover:w-12 transition-all duration-300" />
              </button>
            </motion.div>
          </div>

          {/* Right - Visual & Stats */}
          <div className="lg:col-span-5 relative">
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { number: '50+', label: 'ENTREPRISES', sublabel: 'Accompagnées' },
                  { number: '98%', label: 'CLIENTS', sublabel: 'Satisfaits' },
                  { number: '24H', label: 'RÉPONSE', sublabel: 'Garantie' },
                  { number: '3x', label: 'PLUS DE LEADS', sublabel: 'En moyenne' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="group relative p-6 border border-border hover:border-accent/50 transition-colors duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  >
                    <div className="absolute top-2 right-2 font-mono text-[10px] text-text-muted">
                      00{index + 1}
                    </div>
                    <div className="font-display text-4xl md:text-5xl text-accent mb-2">
                      {stat.number}
                    </div>
                    <div className="font-mono text-xs text-text-muted tracking-wider">
                      {stat.label}
                    </div>
                    <div className="font-mono text-[10px] text-text-muted/50 mt-1">
                      {stat.sublabel}
                    </div>
                    {/* Hover accent line */}
                    <div className="absolute bottom-0 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-500" />
                  </motion.div>
                ))}
              </div>

              {/* Decorative element */}
              <motion.div
                className="absolute -bottom-8 -right-8 w-32 h-32 border border-accent/20"
                initial={{ opacity: 0, rotate: -10 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <div className="absolute inset-4 border border-accent/10" />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom decorative elements */}
        <motion.div
          className="absolute bottom-12 left-0 right-0 flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <div className="flex items-center gap-8">
            <span className="font-mono text-xs text-text-muted">SCROLL</span>
            <motion.div
              className="w-px h-12 bg-accent/50"
              animate={{ scaleY: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['WEB', 'IA', 'TRADING', 'AUTOMATION'].map((tag) => (
              <span key={tag} className="font-mono text-xs text-text-muted hover:text-accent transition-colors cursor-default">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Large background text */}
      <div className="absolute bottom-0 right-0 overflow-hidden pointer-events-none opacity-[0.02]">
        <span className="font-display text-[30vw] leading-none text-white">
          QI
        </span>
      </div>
    </section>
  );
}
