import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface BillingToggleProps {
  interval: "monthly" | "yearly"
  onChange: (interval: "monthly" | "yearly") => void
  isDark?: boolean
}

export function BillingToggle({ interval, onChange, isDark = false }: BillingToggleProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <span
        className={cn(
          "text-sm font-medium transition-colors",
          interval === "monthly"
            ? isDark ? "text-white" : "text-gray-900"
            : isDark ? "text-gray-400" : "text-gray-500"
        )}
      >
        Mensuel
      </span>

      <button
        onClick={() => onChange(interval === "monthly" ? "yearly" : "monthly")}
        className={cn(
          "relative w-14 h-7 rounded-full transition-colors duration-300",
          interval === "yearly"
            ? "bg-gradient-to-r from-violet-500 to-purple-600"
            : isDark ? "bg-gray-700" : "bg-gray-300"
        )}
      >
        <motion.div
          className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-md"
          animate={{ x: interval === "yearly" ? 28 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>

      <div className="flex items-center gap-2">
        <span
          className={cn(
            "text-sm font-medium transition-colors",
            interval === "yearly"
              ? isDark ? "text-white" : "text-gray-900"
              : isDark ? "text-gray-400" : "text-gray-500"
          )}
        >
          Annuel
        </span>
        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white">
          -17%
        </span>
      </div>
    </div>
  )
}
