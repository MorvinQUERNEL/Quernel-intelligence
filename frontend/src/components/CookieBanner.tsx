import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

type CookieConsent = {
  essential: boolean;
  analytics: boolean;
  timestamp: number;
};

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>({
    essential: true, // Always true, cannot be disabled
    analytics: false,
    timestamp: 0,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const savedConsent = localStorage.getItem('cookie-consent');
    if (!savedConsent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (newConsent: CookieConsent) => {
    const consentWithTimestamp = {
      ...newConsent,
      timestamp: Date.now(),
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consentWithTimestamp));
    setIsVisible(false);

    // Here you would typically initialize/disable analytics based on consent
    if (newConsent.analytics) {
      // Initialize analytics (e.g., Google Analytics, Plausible, etc.)
      console.log('Analytics enabled');
    }
  };

  const acceptAll = () => {
    saveConsent({
      essential: true,
      analytics: true,
      timestamp: Date.now(),
    });
  };

  const acceptEssentialOnly = () => {
    saveConsent({
      essential: true,
      analytics: false,
      timestamp: Date.now(),
    });
  };

  const saveCustomPreferences = () => {
    saveConsent(consent);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="container max-w-5xl">
            <div className="bg-bg-secondary border border-border shadow-2xl">
              {/* Main content */}
              <div className="p-6 md:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 border border-accent flex items-center justify-center flex-shrink-0">
                    <span className="text-accent text-lg">🍪</span>
                  </div>
                  <div>
                    <h3 className="text-text-primary font-medium mb-2">
                      Nous respectons votre vie privée
                    </h3>
                    <p className="text-text-secondary text-sm">
                      Ce site utilise des cookies pour améliorer votre expérience.
                      Les cookies essentiels sont nécessaires au fonctionnement du site.
                      Vous pouvez choisir d'accepter ou de refuser les cookies analytiques.
                    </p>
                  </div>
                </div>

                {/* Detailed options (collapsible) */}
                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border pt-6 mb-6 space-y-4">
                        {/* Essential cookies */}
                        <div className="flex items-start justify-between gap-4 p-4 bg-bg-primary border border-border">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-text-primary font-medium text-sm">Cookies essentiels</h4>
                              <span className="font-mono text-[10px] text-accent bg-accent/10 px-2 py-0.5">REQUIS</span>
                            </div>
                            <p className="text-text-muted text-xs">
                              Nécessaires au fonctionnement du site. Ils permettent de mémoriser
                              vos préférences et d'assurer la sécurité.
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="w-12 h-6 bg-accent/20 rounded-full relative cursor-not-allowed">
                              <div className="absolute right-1 top-1 w-4 h-4 bg-accent rounded-full" />
                            </div>
                          </div>
                        </div>

                        {/* Analytics cookies */}
                        <div className="flex items-start justify-between gap-4 p-4 bg-bg-primary border border-border">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-text-primary font-medium text-sm">Cookies analytiques</h4>
                              <span className="font-mono text-[10px] text-text-muted bg-bg-secondary px-2 py-0.5">OPTIONNEL</span>
                            </div>
                            <p className="text-text-muted text-xs">
                              Nous aident à comprendre comment les visiteurs utilisent le site
                              pour l'améliorer. Les données sont anonymisées.
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <button
                              onClick={() => setConsent(prev => ({ ...prev, analytics: !prev.analytics }))}
                              className={`w-12 h-6 rounded-full relative transition-colors ${
                                consent.analytics ? 'bg-accent/20' : 'bg-border'
                              }`}
                            >
                              <div
                                className={`absolute top-1 w-4 h-4 rounded-full transition-all ${
                                  consent.analytics
                                    ? 'right-1 bg-accent'
                                    : 'left-1 bg-text-muted'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {showDetails ? (
                    <>
                      <button
                        onClick={saveCustomPreferences}
                        className="flex-1 sm:flex-none px-6 py-3 bg-accent text-bg-primary font-mono text-xs tracking-wider hover:bg-accent-hover transition-colors"
                      >
                        ENREGISTRER MES CHOIX
                      </button>
                      <button
                        onClick={() => setShowDetails(false)}
                        className="flex-1 sm:flex-none px-6 py-3 border border-border text-text-secondary font-mono text-xs tracking-wider hover:border-accent hover:text-accent transition-colors"
                      >
                        RETOUR
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={acceptAll}
                        className="flex-1 sm:flex-none px-6 py-3 bg-accent text-bg-primary font-mono text-xs tracking-wider hover:bg-accent-hover transition-colors"
                      >
                        TOUT ACCEPTER
                      </button>
                      <button
                        onClick={acceptEssentialOnly}
                        className="flex-1 sm:flex-none px-6 py-3 border border-border text-text-secondary font-mono text-xs tracking-wider hover:border-accent hover:text-accent transition-colors"
                      >
                        ESSENTIEL UNIQUEMENT
                      </button>
                      <button
                        onClick={() => setShowDetails(true)}
                        className="flex-1 sm:flex-none px-6 py-3 text-text-muted font-mono text-xs tracking-wider hover:text-accent transition-colors"
                      >
                        PERSONNALISER
                      </button>
                    </>
                  )}
                </div>

                {/* Privacy policy link */}
                <p className="mt-4 text-text-muted text-xs">
                  En savoir plus dans notre{' '}
                  <Link to="/confidentialite" className="text-accent hover:underline">
                    politique de confidentialité
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
