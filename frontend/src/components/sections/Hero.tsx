import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background blobs */}
      <div className="bg-gradient-blob-1" />
      <div className="bg-gradient-blob-2" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left content - 60% */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Badge variant="secondary" className="mb-6">
                Création Web & Intelligence Artificielle
              </Badge>

              <h1 className="mb-6">
                Nous créons votre site web.
                <br />
                <span className="text-accent">Et nous le rendons intelligent.</span>
              </h1>

              <p className="text-lg md:text-xl text-text-secondary mb-8 max-w-xl">
                Sites performants, agents IA, bots de trading — Quernel Intelligence
                conçoit les outils digitaux qui travaillent pour vous, même quand vous dormez.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Démarrer un projet
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Voir nos services
                </Button>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-6 text-text-muted text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-text-primary font-medium">+50</span>
                  <span>projets livrés</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-2">
                  <span className="font-mono text-text-primary font-medium">98%</span>
                  <span>satisfaction client</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right visual - 40% */}
          <motion.div
            className="lg:col-span-2 hidden lg:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="relative">
              {/* Browser mockup */}
              <div className="bg-bg-secondary border border-border rounded-xl overflow-hidden shadow-lg">
                {/* Browser header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-bg-tertiary rounded px-3 py-1 text-xs text-text-muted font-mono">
                      votre-site.com
                    </div>
                  </div>
                </div>

                {/* Browser content */}
                <div className="p-6 min-h-[300px] relative">
                  {/* Website preview mockup */}
                  <div className="space-y-4">
                    <div className="h-8 w-32 bg-bg-tertiary rounded" />
                    <div className="h-4 w-full bg-bg-tertiary rounded" />
                    <div className="h-4 w-3/4 bg-bg-tertiary rounded" />
                    <div className="h-4 w-1/2 bg-bg-tertiary rounded" />
                    <div className="grid grid-cols-3 gap-3 mt-6">
                      <div className="h-20 bg-bg-tertiary rounded" />
                      <div className="h-20 bg-bg-tertiary rounded" />
                      <div className="h-20 bg-bg-tertiary rounded" />
                    </div>
                  </div>

                  {/* AI Chatbot overlay */}
                  <div className="absolute bottom-4 right-4 w-48 bg-bg-primary border border-accent/30 rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-accent/10 px-3 py-2 border-b border-accent/20">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                        <span className="text-xs font-medium text-accent">Assistant IA</span>
                      </div>
                    </div>
                    <div className="p-3 space-y-2">
                      <div className="bg-bg-tertiary rounded-lg px-3 py-2 text-xs text-text-secondary">
                        Comment puis-je vous aider ?
                      </div>
                      <div className="flex gap-1">
                        <div className="h-6 flex-1 bg-bg-secondary border border-border rounded text-xs" />
                        <div className="w-6 h-6 bg-accent rounded flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating tech badges */}
              <div className="absolute -left-4 top-1/4 bg-bg-secondary border border-border rounded-lg px-3 py-2 shadow-md">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#61DAFB]/20 rounded flex items-center justify-center text-xs">⚛</div>
                  <span className="text-xs font-medium">React</span>
                </div>
              </div>
              <div className="absolute -right-4 bottom-1/4 bg-bg-secondary border border-border rounded-lg px-3 py-2 shadow-md">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-accent/20 rounded flex items-center justify-center text-xs">🤖</div>
                  <span className="text-xs font-medium">IA</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
