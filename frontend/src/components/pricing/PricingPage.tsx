import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Shield, CreditCard, Check, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { BillingToggle } from "./BillingToggle"
import { PlanCard } from "./PlanCard"
import { useSubscriptionStore, type Plan } from "@/stores/subscriptionStore"
import { useAuthStore } from "@/stores/authStore"
import { cn } from "@/lib/utils"

interface PricingPageProps {
  onNavigateBack: () => void
  onNavigateToRegister: () => void
}

export function PricingPage({ onNavigateBack, onNavigateToRegister }: PricingPageProps) {
  const [isDark, setIsDark] = useState(true)
  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly")
  const { plans, loadPlans, createCheckoutSession, isLoading } = useSubscriptionStore()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    loadPlans()
    // Check dark mode preference
    setIsDark(document.documentElement.classList.contains("dark"))
  }, [loadPlans])

  const handleSelectPlan = async (plan: Plan) => {
    if (plan.isEnterprise || plan.slug === "enterprise") {
      window.location.href = "mailto:contact@quernel-intelligence.com?subject=Demande Enterprise"
      return
    }

    if (plan.slug === "free") {
      onNavigateToRegister()
      return
    }

    if (!isAuthenticated) {
      onNavigateToRegister()
      return
    }

    try {
      const checkoutUrl = await createCheckoutSession(plan.slug, interval)
      window.location.href = checkoutUrl
    } catch (error) {
      console.error("Error creating checkout session:", error)
    }
  }

  const currentPlanSlug = user?.plan?.slug || "free"

  // FAQ items
  const faqItems = [
    {
      question: "Puis-je changer de plan à tout moment ?",
      answer: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements sont appliqués immédiatement et le prorata est calculé automatiquement.",
    },
    {
      question: "Comment fonctionne l'essai gratuit ?",
      answer: "L'essai gratuit vous donne accès à toutes les fonctionnalités du plan Pro pendant 7 jours. Aucune carte bancaire n'est requise pour commencer.",
    },
    {
      question: "Puis-je annuler à tout moment ?",
      answer: "Oui, vous pouvez annuler votre abonnement à tout moment depuis votre espace facturation. Vous conserverez l'accès jusqu'à la fin de la période payée.",
    },
    {
      question: "Quels moyens de paiement acceptez-vous ?",
      answer: "Nous acceptons les cartes bancaires (Visa, Mastercard, American Express), ainsi que les virements SEPA pour les plans Enterprise.",
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
                <span className="text-white font-bold text-sm">Q</span>
              </div>
              <span className={cn("font-bold", isDark ? "text-white" : "text-gray-900")}>
                QUERNEL
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              Choisissez votre{" "}
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                plan
              </span>
            </h1>
            <p className={cn(
              "text-lg max-w-2xl mx-auto mb-8",
              isDark ? "text-gray-400" : "text-gray-600"
            )}>
              Accédez à 9 agents IA spécialisés pour transformer votre entreprise.
              Sans engagement, annulable à tout moment.
            </p>

            <BillingToggle interval={interval} onChange={setInterval} isDark={isDark} />
          </motion.div>

          {/* Plans Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 mb-20"
          >
            {plans.map((plan, index) => (
              <motion.div
                key={plan.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <PlanCard
                  plan={plan}
                  interval={interval}
                  isCurrentPlan={isAuthenticated && currentPlanSlug === plan.slug}
                  isDark={isDark}
                  onSelect={handleSelectPlan}
                  isLoading={isLoading}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Feature Comparison */}
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
              "text-2xl font-bold mb-8 text-center",
              isDark ? "text-white" : "text-gray-900"
            )}>
              Comparaison des plans
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={cn("border-b", isDark ? "border-white/10" : "border-gray-200")}>
                    <th className={cn("text-left py-4 px-4", isDark ? "text-gray-400" : "text-gray-500")}>
                      Fonctionnalité
                    </th>
                    {plans.map((plan) => (
                      <th
                        key={plan.slug}
                        className={cn(
                          "text-center py-4 px-4",
                          isDark ? "text-white" : "text-gray-900"
                        )}
                      >
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Agents IA", values: ["1", "5", "20", "Illimité"] },
                    { label: "Tokens/mois", values: ["50K", "500K", "2M", "Illimité"] },
                    { label: "Documents", values: ["5", "50", "200", "Illimité"] },
                    { label: "Support", values: ["Email", "Prioritaire", "24/7", "Dédié"] },
                    { label: "API Access", values: [false, true, true, true] },
                    { label: "Équipe", values: [false, false, "5 membres", "Illimité"] },
                    { label: "SLA", values: [false, false, false, true] },
                  ].map((row, index) => (
                    <tr
                      key={index}
                      className={cn("border-b", isDark ? "border-white/5" : "border-gray-100")}
                    >
                      <td className={cn("py-4 px-4 font-medium", isDark ? "text-gray-300" : "text-gray-700")}>
                        {row.label}
                      </td>
                      {row.values.map((value, i) => (
                        <td key={i} className="text-center py-4 px-4">
                          {typeof value === "boolean" ? (
                            value ? (
                              <Check className={cn("w-5 h-5 mx-auto", isDark ? "text-emerald-400" : "text-emerald-500")} />
                            ) : (
                              <span className={isDark ? "text-gray-600" : "text-gray-400"}>-</span>
                            )
                          ) : (
                            <span className={isDark ? "text-gray-300" : "text-gray-700"}>{value}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
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
              Questions fréquentes
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
                Paiement sécurisé Stripe
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🇫🇷</span>
              <span className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                100% hébergé en France
              </span>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
