import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Shield, CreditCard } from "lucide-react"
import { BillingToggle } from "./BillingToggle"
import { PlanCard } from "./PlanCard"
import { useSubscriptionStore, type Plan } from "@/stores/subscriptionStore"
import { useAuthStore } from "@/stores/authStore"
import { cn } from "@/lib/utils"

interface PricingSectionProps {
  isDark?: boolean
  onNavigateToRegister?: () => void
}

export function PricingSection({ isDark = false, onNavigateToRegister }: PricingSectionProps) {
  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly")
  const { plans, loadPlans, createCheckoutSession, isLoading } = useSubscriptionStore()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    loadPlans()
  }, [loadPlans])

  const handleSelectPlan = async (plan: Plan) => {
    // Enterprise plan - redirect to contact
    if (plan.isEnterprise || plan.slug === "enterprise") {
      window.location.href = "mailto:contact@quernel-intelligence.com?subject=Demande Enterprise"
      return
    }

    // Free plan - redirect to register
    if (plan.slug === "free") {
      if (onNavigateToRegister) {
        onNavigateToRegister()
      }
      return
    }

    // Paid plans - create Stripe checkout session
    if (!isAuthenticated) {
      // If not authenticated, redirect to register first
      if (onNavigateToRegister) {
        onNavigateToRegister()
      }
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

  return (
    <section id="pricing" className={cn("py-20", isDark ? "bg-[#12121a]" : "bg-white")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className={cn(
            "text-3xl sm:text-4xl font-bold mb-4",
            isDark ? "text-white" : "text-gray-900"
          )}>
            Des tarifs{" "}
            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              transparents
            </span>
          </h2>
          <p className={cn(
            "text-lg max-w-2xl mx-auto mb-8",
            isDark ? "text-gray-400" : "text-gray-600"
          )}>
            Choisissez le plan adapté à vos besoins. Changez ou annulez à tout moment.
          </p>

          {/* Billing Toggle */}
          <BillingToggle interval={interval} onChange={setInterval} isDark={isDark} />
        </motion.div>

        {/* Plans Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
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

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8"
        >
          <div className="flex items-center gap-2">
            <Shield className={cn("w-5 h-5", isDark ? "text-emerald-400" : "text-emerald-600")} />
            <span className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
              Données hébergées en France
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
              Entreprise française (SIREN: 979632072)
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
