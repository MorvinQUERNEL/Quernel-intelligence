import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

interface LegalLayoutProps {
  title: string
  lastUpdated: string
  children: React.ReactNode
  onNavigateBack: () => void
}

export function LegalLayout({ title, lastUpdated, children, onNavigateBack }: LegalLayoutProps) {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"))
  }, [])

  const toggleDarkMode = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <div className={cn("min-h-screen", isDark ? "dark bg-[#0a0a0f]" : "bg-gray-50")}>
      {/* Header */}
      <header className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-lg",
        isDark ? "bg-[#0a0a0f]/90 border-white/10" : "bg-white/90 border-gray-200"
      )}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onNavigateBack}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors",
                isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
              )}
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">Q</span>
              </div>
              <span className={cn("font-bold", isDark ? "text-white" : "text-gray-900")}>
                QUERNEL
              </span>
            </div>

            <button
              onClick={toggleDarkMode}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isDark ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-600"
              )}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-2xl border p-8 md:p-12",
              isDark ? "bg-[#12121a] border-white/10" : "bg-white border-gray-200"
            )}
          >
            {/* Title */}
            <header className="mb-8 pb-8 border-b border-[var(--color-border)]">
              <h1 className={cn(
                "text-3xl md:text-4xl font-bold mb-2",
                isDark ? "text-white" : "text-gray-900"
              )}>
                {title}
              </h1>
              <p className={cn("text-sm", isDark ? "text-gray-500" : "text-gray-500")}>
                Dernière mise à jour : {lastUpdated}
              </p>
            </header>

            {/* Body */}
            <div className={cn(
              "prose prose-lg max-w-none",
              isDark && "prose-invert",
              // Custom prose styles
              "[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4",
              "[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3",
              "[&_p]:mb-4 [&_p]:leading-relaxed",
              "[&_ul]:my-4 [&_ul]:pl-6",
              "[&_li]:mb-2",
              "[&_a]:text-violet-500 [&_a]:hover:text-violet-600 [&_a]:no-underline [&_a]:hover:underline",
              isDark
                ? "[&_h2]:text-white [&_h3]:text-white [&_p]:text-gray-300 [&_li]:text-gray-300 [&_strong]:text-white"
                : "[&_h2]:text-gray-900 [&_h3]:text-gray-900 [&_p]:text-gray-600 [&_li]:text-gray-600"
            )}>
              {children}
            </div>
          </motion.article>

          {/* Footer Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            {[
              { href: "#privacy", label: "Confidentialité" },
              { href: "#terms", label: "CGU" },
              { href: "#legal", label: "Mentions légales" },
              { href: "#cookies", label: "Cookies" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm transition-colors",
                  isDark ? "text-gray-500 hover:text-violet-400" : "text-gray-500 hover:text-violet-600"
                )}
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className={cn(
        "py-8 border-t",
        isDark ? "bg-[#0a0a0f] border-white/10" : "bg-gray-50 border-gray-200"
      )}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className={cn("text-sm", isDark ? "text-gray-500" : "text-gray-400")}>
            © 2026 QUERNEL INTELLIGENCE SASU. Tous droits réservés.
          </p>
          <p className={cn("text-sm mt-1", isDark ? "text-gray-600" : "text-gray-400")}>
            SIREN: 979632072 - Hébergé en France
          </p>
        </div>
      </footer>
    </div>
  )
}
