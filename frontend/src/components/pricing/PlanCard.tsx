import { motion } from "framer-motion"
import { Check, Sparkles, Building2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import type { Plan } from "@/stores/subscriptionStore"

interface PlanCardProps {
  plan: Plan
  interval: "monthly" | "yearly"
  isCurrentPlan?: boolean
  isDark?: boolean
  onSelect: (plan: Plan) => void
  isLoading?: boolean
}

export function PlanCard({
  plan,
  interval,
  isCurrentPlan = false,
  isDark = false,
  onSelect,
  isLoading = false,
}: PlanCardProps) {
  const price = interval === "monthly" ? plan.priceMonthly : plan.priceYearly
  const isEnterprise = plan.isEnterprise || plan.slug === "enterprise"
  const isFree = plan.slug === "free"
  const isPopular = plan.isPopular || plan.slug === "pro"

  const formatPrice = (value: number) => {
    if (value === -1 || value === 0) return null
    return value.toLocaleString("fr-FR")
  }

  const priceDisplay = formatPrice(price)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative flex flex-col p-6 rounded-2xl border transition-all duration-300",
        // Glassmorphism effect
        isDark
          ? "backdrop-blur-xl bg-white/5 border-white/10 hover:border-white/20"
          : "backdrop-blur-xl bg-white/70 border-white/20 hover:border-violet-200",
        // Shadow
        "hover:shadow-[var(--shadow-card-hover)]",
        // Popular plan special styling
        isPopular && [
          "border-2",
          isDark ? "border-violet-500/50 bg-violet-500/10" : "border-violet-500 bg-violet-50/50",
          "shadow-[var(--shadow-glow)]",
        ],
        // Current plan styling
        isCurrentPlan && "ring-2 ring-green-500 ring-offset-2",
        isCurrentPlan && (isDark ? "ring-offset-[#0a0a0f]" : "ring-offset-white")
      )}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold shadow-lg"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Populaire
          </motion.div>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute -top-3 right-4">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500 text-white">
            Plan actuel
          </span>
        </div>
      )}

      {/* Plan Header */}
      <div className={cn("text-center", isPopular && "pt-2")}>
        <div className={cn(
          "inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4",
          isEnterprise
            ? "bg-gradient-to-br from-slate-600 to-gray-700"
            : isPopular
            ? "bg-gradient-to-br from-violet-500 to-purple-600"
            : isFree
            ? "bg-gradient-to-br from-gray-400 to-gray-500"
            : "bg-gradient-to-br from-blue-500 to-indigo-600"
        )}>
          {isEnterprise ? (
            <Building2 className="w-6 h-6 text-white" />
          ) : (
            <Sparkles className="w-6 h-6 text-white" />
          )}
        </div>

        <h3 className={cn(
          "text-xl font-bold mb-2",
          isDark ? "text-white" : "text-gray-900"
        )}>
          {plan.name}
        </h3>

        {/* Price */}
        <div className="mb-4">
          {isEnterprise ? (
            <div className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>
              Sur mesure
            </div>
          ) : isFree ? (
            <div className={cn("text-4xl font-bold", isDark ? "text-white" : "text-gray-900")}>
              Gratuit
            </div>
          ) : (
            <div className="flex items-baseline justify-center gap-1">
              <span className={cn("text-4xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                {priceDisplay}
              </span>
              <span className={cn("text-lg", isDark ? "text-gray-400" : "text-gray-500")}>
                €
              </span>
              <span className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                /{interval === "monthly" ? "mois" : "an"}
              </span>
            </div>
          )}

          {/* Annual savings hint */}
          {!isFree && !isEnterprise && interval === "yearly" && (
            <p className="mt-1 text-sm text-emerald-500 font-medium">
              Soit {Math.round(price / 12)}€/mois
            </p>
          )}
        </div>
      </div>

      {/* Features List */}
      <div className="flex-1 space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start gap-3"
          >
            <div className={cn(
              "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5",
              isPopular
                ? "bg-gradient-to-br from-violet-500 to-purple-600"
                : "bg-gradient-to-br from-emerald-500 to-green-500"
            )}>
              <Check className="w-3 h-3 text-white" />
            </div>
            <span className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-600")}>
              {feature}
            </span>
          </motion.div>
        ))}
      </div>

      {/* CTA Button */}
      <Button
        onClick={() => onSelect(plan)}
        disabled={isLoading || isCurrentPlan}
        className={cn(
          "w-full py-6 text-base font-semibold transition-all duration-300",
          isPopular
            ? "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0"
            : isEnterprise
            ? "bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800 text-white border-0"
            : isFree
            ? cn(
                isDark
                  ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200"
              )
            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0",
          isCurrentPlan && "opacity-50 cursor-not-allowed"
        )}
      >
        {isCurrentPlan
          ? "Plan actuel"
          : isEnterprise
          ? "Contacter"
          : isFree
          ? "Commencer"
          : "Souscrire"}
      </Button>

      {/* Payment info */}
      {!isFree && !isEnterprise && (
        <p className={cn(
          "text-center text-xs mt-3",
          isDark ? "text-gray-500" : "text-gray-400"
        )}>
          Paiement sécurisé par Stripe
        </p>
      )}
    </motion.div>
  )
}
