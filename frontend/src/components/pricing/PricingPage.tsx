import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Shield, CreditCard, Check, HelpCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useSubscriptionStore, type Plan } from "@/stores/subscriptionStore"
import { useAuthStore } from "@/stores/authStore"
import { cn } from "@/lib/utils"

interface PricingPageProps {
  onNavigateBack: () => void
  onNavigateToRegister: () => void
}

export function PricingPage({ onNavigateBack, onNavigateToRegister }: PricingPageProps) {
  const [isDark, setIsDark] = useState(true)
  const { plans, loadPlans, createCheckoutSession, isLoading } = useSubscriptionStore()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    loadPlans()
    setIsDark(document.documentElement.classList.contains("dark"))
  }, [loadPlans])

  const handleSelectPlan = async (plan: Plan) => {
    if (plan.slug === "free") {
      onNavigateToRegister()
      return
    }

    if (!isAuthenticated) {
      onNavigateToRegister()
      return
    }

    try {
      const checkoutUrl = await createCheckoutSession(plan.slug, "monthly")
      window.location.href = checkoutUrl
    } catch (error) {
      console.error("Error creating checkout session:", error)
    }
  }

  const currentPlanSlug = user?.plan?.slug || "free"

  const faqItems = [
    {
      question: "Comment fonctionne l'essai gratuit ?",
      answer: "L'essai gratuit vous donne acces aux 3 Anges IA pendant 7 jours. Aucune carte bancaire n'est requise pour commencer. Apres 7 jours, vous pouvez passer au plan Pro a 50euros/mois.",
    },
    {
      question: "Quels sont les 3 Anges IA ?",
      answer: "Raphael (assistant general), Gabriel (expert marketing et SEO), et Michael (expert commercial). Ils partagent un contexte commun pour une experience coherente.",
    },
    {
      question: "Puis-je annuler a tout moment ?",
      answer: "Oui, vous pouvez annuler votre abonnement a tout moment depuis votre espace facturation. Vous conserverez l'acces jusqu'a la fin de la periode payee.",
    },
    {
      question: "Mes donnees sont-elles securisees ?",
      answer: "Absolument. Toutes vos conversations sont chiffrees (AES-256) et hebergees en France, conformement au RGPD.",
    },
  ]

  return (
    <div className={cn("min-h-screen", isDark ? "dark bg-[#0a0a0f]" : "bg-gray-50")}>
      {/* Header */}
      <header className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-lg",
        isDark ? "bg-[#0a0a0f]/90 border-white/10" : "bg-white/90 border-gray-200"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <span className="text-white font-bold text-sm">QI</span>
              </div>
              <span className={cn("font-bold text-sm", isDark ? "text-white" : "text-gray-900")}>
                QUERNEL INTELLIGENCE
              </span>
            </div>

            <Button
              onClick={onNavigateToRegister}
              className="bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0"
            >
              Commencer
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className={cn(
              "text-4xl sm:text-5xl font-bold mb-4",
              isDark ? "text-white" : "text-gray-900"
            )}>
              Un prix simple,{" "}
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                sans surprise
              </span>
            </h1>
            <p className={cn(
              "text-lg max-w-2xl mx-auto mb-4",
              isDark ? "text-gray-400" : "text-gray-600"
            )}>
              Acces complet aux 3 Anges IA pour transformer votre entreprise.
              7 jours d'essai gratuit, puis 50euros/mois.
            </p>
          </motion.div>

          {/* Plans */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-4xl mx-auto"
          >
            {/* Free Trial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={cn(
                "relative p-8 rounded-2xl border",
                isDark ? "bg-[#12121a] border-white/10" : "bg-white border-gray-200"
              )}
            >
              <h3 className={cn("text-xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>
                Essai Gratuit
              </h3>
              <p className={cn("text-sm mb-6", isDark ? "text-gray-400" : "text-gray-600")}>
                Testez pendant 7 jours
              </p>

              <div className="mb-6">
                <span className={cn("text-4xl font-bold", isDark ? "text-white" : "text-gray-900")}>0euros</span>
                <span className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}> / 7 jours</span>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  "3 Anges IA (Raphael, Gabriel, Michael)",
                  "Contexte partage entre anges",
                  "100 000 tokens",
                  "10 documents",
                  "Support email",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className={cn("w-5 h-5", isDark ? "text-emerald-400" : "text-emerald-500")} />
                    <span className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-700")}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSelectPlan(plans[0] || { slug: "free" } as Plan)}
                disabled={isLoading}
                className={cn(
                  "w-full",
                  isDark ? "bg-white/10 text-white hover:bg-white/20" : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                )}
                variant="outline"
              >
                Commencer gratuitement
              </Button>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={cn(
                "relative p-8 rounded-2xl border-2",
                "border-violet-500 bg-gradient-to-b",
                isDark ? "from-violet-500/10 to-transparent" : "from-violet-50 to-white"
              )}
            >
              {/* Popular badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                  Recommande
                </span>
              </div>

              <h3 className={cn("text-xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>
                Pro
              </h3>
              <p className={cn("text-sm mb-6", isDark ? "text-gray-400" : "text-gray-600")}>
                Pour les professionnels
              </p>

              <div className="mb-6">
                <span className={cn("text-4xl font-bold", isDark ? "text-white" : "text-gray-900")}>50euros</span>
                <span className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}> / mois</span>
                <p className={cn("text-xs mt-1", isDark ? "text-gray-500" : "text-gray-400")}>
                  ou 480euros/an (2 mois offerts)
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  "3 Anges IA experts",
                  "Contexte partage intelligent",
                  "2M tokens/mois",
                  "100 documents",
                  "Historique illimite",
                  "Support prioritaire",
                  "API access",
                  "Exports avances",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className={cn("w-5 h-5", isDark ? "text-emerald-400" : "text-emerald-500")} />
                    <span className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-700")}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSelectPlan(plans[1] || { slug: "pro" } as Plan)}
                disabled={isLoading || (isAuthenticated && currentPlanSlug === "pro")}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0"
              >
                {isAuthenticated && currentPlanSlug === "pro" ? "Plan actuel" : "Commencer l'essai gratuit"}
              </Button>
            </motion.div>
          </motion.div>

          {/* Les 3 Anges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
              "rounded-2xl border p-8 mb-20",
              isDark ? "bg-[#12121a] border-white/10" : "bg-white border-gray-200"
            )}
          >
            <h2 className={cn(
              "text-2xl font-bold mb-8 text-center flex items-center justify-center gap-2",
              isDark ? "text-white" : "text-gray-900"
            )}>
              <Sparkles className="w-6 h-6 text-violet-400" />
              Les 3 Anges inclus
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Raphael",
                  role: "Assistant General",
                  description: "Ange guerisseur - Organisation, redaction, productivite",
                  color: "from-violet-500 to-purple-600"
                },
                {
                  name: "Gabriel",
                  role: "Expert Marketing",
                  description: "Ange messager - SEO, contenu, publicite, communication",
                  color: "from-pink-500 to-rose-500"
                },
                {
                  name: "Michael",
                  role: "Expert Commercial",
                  description: "Ange protecteur - Vente, prospection, negociation",
                  color: "from-emerald-500 to-green-600"
                }
              ].map((angel, index) => (
                <div key={index} className={cn(
                  "p-6 rounded-xl border text-center",
                  isDark ? "border-white/10" : "border-gray-200"
                )}>
                  <div className={cn(
                    "w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-br",
                    angel.color
                  )}>
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={cn("font-bold mb-1", isDark ? "text-white" : "text-gray-900")}>
                    {angel.name}
                  </h3>
                  <p className={cn("text-sm font-medium mb-2", isDark ? "text-violet-400" : "text-violet-600")}>
                    {angel.role}
                  </p>
                  <p className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-600")}>
                    {angel.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className={cn(
              "text-2xl font-bold mb-8 text-center flex items-center justify-center gap-2",
              isDark ? "text-white" : "text-gray-900"
            )}>
              <HelpCircle className="w-6 h-6" />
              Questions frequentes
            </h2>

            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "p-6 rounded-xl border",
                    isDark ? "bg-[#12121a] border-white/10" : "bg-white border-gray-200"
                  )}
                >
                  <h3 className={cn("font-semibold mb-2", isDark ? "text-white" : "text-gray-900")}>
                    {item.question}
                  </h3>
                  <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                    {item.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8"
          >
            <div className="flex items-center gap-2">
              <Shield className={cn("w-5 h-5", isDark ? "text-emerald-400" : "text-emerald-600")} />
              <span className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                Conforme RGPD
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className={cn("w-5 h-5", isDark ? "text-violet-400" : "text-violet-600")} />
              <span className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                Paiement securise Stripe
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">FR</span>
              <span className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                100% heberge en France
              </span>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
