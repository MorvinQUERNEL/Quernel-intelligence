import { motion, AnimatePresence } from "framer-motion"
import { Cookie, Settings, X } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useCookieStore } from "@/stores/cookieStore"
import { cn } from "@/lib/utils"

interface CookieConsentProps {
  isDark?: boolean
}

export function CookieConsent({ isDark = false }: CookieConsentProps) {
  const { hasConsented, showBanner, acceptAll, rejectAll, openPreferences, closeBanner } = useCookieStore()

  // Don't show if already consented or banner closed
  if (hasConsented || !showBanner) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6",
          isDark ? "bg-[#12121a]/95" : "bg-white/95",
          "backdrop-blur-lg border-t",
          isDark ? "border-white/10" : "border-gray-200"
        )}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6">
            {/* Icon & Text */}
            <div className="flex items-start gap-4 flex-1">
              <div className={cn(
                "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center",
                "bg-gradient-to-br from-violet-500/20 to-purple-500/20"
              )}>
                <Cookie className={cn("w-6 h-6", isDark ? "text-violet-400" : "text-violet-600")} />
              </div>
              <div>
                <h3 className={cn(
                  "text-lg font-semibold mb-1",
                  isDark ? "text-white" : "text-gray-900"
                )}>
                  Nous utilisons des cookies
                </h3>
                <p className={cn(
                  "text-sm leading-relaxed",
                  isDark ? "text-gray-400" : "text-gray-600"
                )}>
                  Nous utilisons des cookies pour améliorer votre expérience sur notre site.
                  Les cookies essentiels sont nécessaires au fonctionnement du site.
                  Vous pouvez personnaliser vos préférences à tout moment.{" "}
                  <a
                    href="#cookies"
                    className="text-violet-500 hover:text-violet-600 underline"
                  >
                    En savoir plus
                  </a>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={openPreferences}
                className={cn(
                  "flex items-center gap-2",
                  isDark ? "text-gray-400 hover:text-white hover:bg-white/10" : ""
                )}
              >
                <Settings className="w-4 h-4" />
                Personnaliser
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={rejectAll}
                className={cn(
                  isDark ? "border-white/20 text-white hover:bg-white/10" : ""
                )}
              >
                Refuser
              </Button>
              <Button
                size="sm"
                onClick={acceptAll}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0"
              >
                Accepter tout
              </Button>
            </div>

            {/* Close button (mobile) */}
            <button
              onClick={closeBanner}
              className={cn(
                "absolute top-4 right-4 lg:hidden p-2 rounded-lg transition-colors",
                isDark ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-500"
              )}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
