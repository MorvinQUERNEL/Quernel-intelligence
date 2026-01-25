import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, AlertTriangle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"

const BETA_ACCESS_KEY = "quernel-beta-access"
const BETA_CODE = "Kayla1908"

interface BetaAccessGateProps {
  children: React.ReactNode
}

export function BetaAccessGate({ children }: BetaAccessGateProps) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  // Check if user already has access
  useEffect(() => {
    const savedAccess = localStorage.getItem(BETA_ACCESS_KEY)
    if (savedAccess === "granted") {
      setHasAccess(true)
    } else {
      setHasAccess(false)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (code === BETA_CODE) {
      setIsSuccess(true)
      setTimeout(() => {
        localStorage.setItem(BETA_ACCESS_KEY, "granted")
        setHasAccess(true)
      }, 1000)
    } else {
      setError("Code d'acces incorrect")
      setCode("")
    }
  }

  // Still checking access
  if (hasAccess === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-xl">Q</span>
          </div>
          <p className="text-gray-400">Chargement...</p>
        </div>
      </div>
    )
  }

  // User has access - show the app
  if (hasAccess) {
    return <>{children}</>
  }

  // Show access gate
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 bg-violet-500 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-15 bg-purple-500 animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-[#12121a] border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Site en phase de test
            </h1>
            <p className="text-gray-400 text-sm">
              QUERNEL INTELLIGENCE est actuellement en version beta privee.
              <br />
              Veuillez entrer le code d'acces pour continuer.
            </p>
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-green-400 font-medium">Acces autorise !</p>
                <p className="text-gray-500 text-sm mt-1">Redirection en cours...</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Code d'acces
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="password"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Entrez le code..."
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                      autoFocus
                    />
                  </div>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-400"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white py-3"
                >
                  Acceder au site
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-gray-500">
              Si vous n'avez pas de code d'acces, contactez l'equipe QUERNEL INTELLIGENCE.
            </p>
          </div>
        </div>

        {/* Logo */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">QI</span>
            </div>
            <span className="text-gray-500 text-sm font-medium">QUERNEL INTELLIGENCE</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
