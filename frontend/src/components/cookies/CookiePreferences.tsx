import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Cookie, Lock, BarChart3, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useCookieStore, type CookiePreferences as CookiePrefs } from "@/stores/cookieStore"
import { cn } from "@/lib/utils"

interface CookiePreferencesProps {
  isDark?: boolean
}

export function CookiePreferences({ isDark = false }: CookiePreferencesProps) {
  const { showPreferences, preferences, closePreferences, savePreferences } = useCookieStore()
  const [localPrefs, setLocalPrefs] = useState<CookiePrefs>(preferences)

  // Sync local state when store changes
  useEffect(() => {
    setLocalPrefs(preferences)
  }, [preferences])

  if (!showPreferences) {
    return null
  }

  const handleToggle = (key: keyof CookiePrefs) => {
    if (key === "essential") return // Cannot toggle essential cookies
    setLocalPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSave = () => {
    savePreferences(localPrefs)
  }

  const handleAcceptAll = () => {
    savePreferences({
      essential: true,
      functional: true,
      analytics: true,
    })
  }

  const cookieCategories = [
    {
      key: "essential" as const,
      title: "Cookies essentiels",
      description: "Ces cookies sont nécessaires au fonctionnement du site. Ils ne peuvent pas être désactivés.",
      icon: Lock,
      required: true,
    },
    {
      key: "functional" as const,
      title: "Cookies fonctionnels",
      description: "Ces cookies permettent de mémoriser vos préférences (thème, langue) pour améliorer votre expérience.",
      icon: Settings2,
      required: false,
    },
    {
      key: "analytics" as const,
      title: "Cookies analytiques",
      description: "Ces cookies nous aident à comprendre comment vous utilisez notre site pour l'améliorer.",
      icon: BarChart3,
      required: false,
    },
  ]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={closePreferences}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden",
            isDark ? "bg-[#12121a] border-white/10" : "bg-white border-gray-200"
          )}
        >
          {/* Header */}
          <div className={cn(
            "flex items-center justify-between p-6 border-b",
            isDark ? "border-white/10" : "border-gray-200"
          )}>
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                "bg-gradient-to-br from-violet-500/20 to-purple-500/20"
              )}>
                <Cookie className={cn("w-5 h-5", isDark ? "text-violet-400" : "text-violet-600")} />
              </div>
              <h2 className={cn(
                "text-xl font-semibold",
                isDark ? "text-white" : "text-gray-900"
              )}>
                Préférences des cookies
              </h2>
            </div>
            <button
              onClick={closePreferences}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isDark ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-500"
              )}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <p className={cn(
              "text-sm mb-6",
              isDark ? "text-gray-400" : "text-gray-600"
            )}>
              Personnalisez vos préférences de cookies. Les cookies essentiels sont toujours actifs
              car ils sont nécessaires au fonctionnement du site.
            </p>

            <div className="space-y-4">
              {cookieCategories.map((category) => {
                const Icon = category.icon
                const isEnabled = localPrefs[category.key]

                return (
                  <div
                    key={category.key}
                    className={cn(
                      "p-4 rounded-xl border transition-colors",
                      isDark
                        ? isEnabled
                          ? "bg-violet-500/10 border-violet-500/30"
                          : "bg-white/5 border-white/10"
                        : isEnabled
                        ? "bg-violet-50 border-violet-200"
                        : "bg-gray-50 border-gray-200"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                          isEnabled
                            ? "bg-violet-500/20"
                            : isDark ? "bg-white/10" : "bg-gray-200"
                        )}>
                          <Icon className={cn(
                            "w-4 h-4",
                            isEnabled
                              ? isDark ? "text-violet-400" : "text-violet-600"
                              : isDark ? "text-gray-500" : "text-gray-400"
                          )} />
                        </div>
                        <div>
                          <h3 className={cn(
                            "font-medium mb-1",
                            isDark ? "text-white" : "text-gray-900"
                          )}>
                            {category.title}
                            {category.required && (
                              <span className="ml-2 text-xs text-violet-500 font-normal">
                                (Requis)
                              </span>
                            )}
                          </h3>
                          <p className={cn(
                            "text-sm",
                            isDark ? "text-gray-400" : "text-gray-600"
                          )}>
                            {category.description}
                          </p>
                        </div>
                      </div>

                      {/* Toggle */}
                      <button
                        onClick={() => handleToggle(category.key)}
                        disabled={category.required}
                        className={cn(
                          "relative flex-shrink-0 w-12 h-6 rounded-full transition-colors",
                          category.required
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer",
                          isEnabled
                            ? "bg-gradient-to-r from-violet-500 to-purple-600"
                            : isDark ? "bg-gray-700" : "bg-gray-300"
                        )}
                      >
                        <motion.div
                          className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm"
                          animate={{ x: isEnabled ? 24 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Footer */}
          <div className={cn(
            "flex items-center justify-between gap-4 p-6 border-t",
            isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"
          )}>
            <a
              href="#cookies"
              onClick={closePreferences}
              className={cn(
                "text-sm transition-colors",
                isDark ? "text-gray-400 hover:text-violet-400" : "text-gray-500 hover:text-violet-600"
              )}
            >
              Politique de cookies
            </a>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className={cn(
                  isDark ? "border-white/20 text-white hover:bg-white/10" : ""
                )}
              >
                Enregistrer mes choix
              </Button>
              <Button
                size="sm"
                onClick={handleAcceptAll}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0"
              >
                Tout accepter
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
