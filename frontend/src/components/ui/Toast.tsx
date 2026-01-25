import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { useToastStore } from "@/stores/toastStore"
import type { Toast as ToastType, ToastType as ToastVariant } from "@/stores/toastStore"
import { cn } from "@/lib/utils"

const toastConfig: Record<ToastVariant, { icon: typeof CheckCircle; bgClass: string; iconClass: string }> = {
  success: {
    icon: CheckCircle,
    bgClass: "bg-green-500/10 border-green-500/30",
    iconClass: "text-green-500",
  },
  error: {
    icon: AlertCircle,
    bgClass: "bg-red-500/10 border-red-500/30",
    iconClass: "text-red-500",
  },
  warning: {
    icon: AlertTriangle,
    bgClass: "bg-yellow-500/10 border-yellow-500/30",
    iconClass: "text-yellow-500",
  },
  info: {
    icon: Info,
    bgClass: "bg-blue-500/10 border-blue-500/30",
    iconClass: "text-blue-500",
  },
}

interface ToastItemProps {
  toast: ToastType
  onClose: () => void
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const config = toastConfig[toast.type]
  const Icon = config.icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "relative flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm shadow-lg",
        "min-w-[320px] max-w-[420px]",
        config.bgClass
      )}
    >
      <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", config.iconClass)} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--color-foreground)]">{toast.title}</p>
        {toast.message && (
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{toast.message}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 rounded-md hover:bg-[var(--color-muted)] transition-colors"
      >
        <X className="h-4 w-4 text-[var(--color-muted-foreground)]" />
      </button>
    </motion.div>
  )
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  )
}
