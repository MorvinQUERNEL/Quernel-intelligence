import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  CreditCard,
  Calendar,
  Zap,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { useSubscriptionStore } from "@/stores/subscriptionStore"
import { useAuthStore } from "@/stores/authStore"

export function BillingPage() {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const { user } = useAuthStore()
  const {
    currentSubscription,
    plans,
    isLoading,
    loadSubscription,
    loadPlans,
    createPortalSession,
    cancelSubscription,
    resumeSubscription,
  } = useSubscriptionStore()

  useEffect(() => {
    loadSubscription()
    loadPlans()
  }, [loadSubscription, loadPlans])

  const currentPlan = plans.find((p) => p.slug === (currentSubscription?.planSlug || user?.plan?.slug || "free"))

  const handleManageBilling = async () => {
    try {
      const portalUrl = await createPortalSession()
      window.location.href = portalUrl
    } catch (error) {
      console.error("Error opening billing portal:", error)
    }
  }

  const handleCancelSubscription = async () => {
    try {
      await cancelSubscription()
      setShowCancelConfirm(false)
    } catch (error) {
      console.error("Error canceling subscription:", error)
    }
  }

  const handleResumeSubscription = async () => {
    try {
      await resumeSubscription()
    } catch (error) {
      console.error("Error resuming subscription:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/10 text-emerald-500">
            <CheckCircle className="w-4 h-4" />
            Actif
          </span>
        )
      case "trialing":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-500">
            <Zap className="w-4 h-4" />
            Essai gratuit
          </span>
        )
      case "canceled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gray-500/10 text-gray-500">
            <XCircle className="w-4 h-4" />
            Annulé
          </span>
        )
      case "past_due":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-500/10 text-red-500">
            <AlertCircle className="w-4 h-4" />
            Paiement en retard
          </span>
        )
      default:
        return null
    }
  }

  const isFree = !currentSubscription || currentPlan?.slug === "free"

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8 max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
            Facturation
          </h1>
          <p className="text-[var(--color-muted-foreground)]">
            Gérez votre abonnement et vos informations de paiement
          </p>
        </motion.div>

        {/* Current Plan Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Plan actuel</CardTitle>
                  <CardDescription>
                    {isFree
                      ? "Vous utilisez le plan gratuit"
                      : `Abonnement ${currentSubscription?.interval === "yearly" ? "annuel" : "mensuel"}`}
                  </CardDescription>
                </div>
                {currentSubscription && getStatusBadge(currentSubscription.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
                      {currentPlan?.name || "Free"}
                    </h3>
                    <p className="text-sm text-[var(--color-muted-foreground)]">
                      {currentPlan?.tokenLimit === -1
                        ? "Tokens illimités"
                        : `${(currentPlan?.tokenLimit || 50000).toLocaleString()} tokens/mois`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {!isFree && currentPlan && (
                    <>
                      <p className="text-2xl font-bold text-[var(--color-foreground)]">
                        {currentSubscription?.interval === "yearly"
                          ? currentPlan.priceYearly
                          : currentPlan.priceMonthly}€
                      </p>
                      <p className="text-sm text-[var(--color-muted-foreground)]">
                        /{currentSubscription?.interval === "yearly" ? "an" : "mois"}
                      </p>
                    </>
                  )}
                  {isFree && (
                    <p className="text-2xl font-bold text-[var(--color-foreground)]">Gratuit</p>
                  )}
                </div>
              </div>

              {/* Subscription details */}
              {currentSubscription && !isFree && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-[var(--color-muted)]">
                    <div className="flex items-center gap-2 text-[var(--color-muted-foreground)] mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Prochaine facturation</span>
                    </div>
                    <p className="font-medium text-[var(--color-foreground)]">
                      {currentSubscription.cancelAtPeriodEnd
                        ? "Abonnement se termine le"
                        : formatDate(currentSubscription.currentPeriodEnd)}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-[var(--color-muted)]">
                    <div className="flex items-center gap-2 text-[var(--color-muted-foreground)] mb-1">
                      <CreditCard className="w-4 h-4" />
                      <span className="text-sm">Méthode de paiement</span>
                    </div>
                    <p className="font-medium text-[var(--color-foreground)]">
                      •••• 4242
                    </p>
                  </div>
                </div>
              )}

              {/* Cancellation warning */}
              {currentSubscription?.cancelAtPeriodEnd && (
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-500">Abonnement en cours d'annulation</p>
                      <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
                        Votre abonnement prendra fin le {formatDate(currentSubscription.currentPeriodEnd)}.
                        Vous pouvez réactiver votre abonnement à tout moment.
                      </p>
                      <Button
                        size="sm"
                        className="mt-3 bg-amber-500 hover:bg-amber-600 text-white"
                        onClick={handleResumeSubscription}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          "Réactiver l'abonnement"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-[var(--color-border)]">
                {isFree ? (
                  <Button
                    className="bg-gradient-to-r from-violet-500 to-purple-600 text-white"
                    onClick={() => window.location.hash = "pricing"}
                  >
                    Passer au Pro
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleManageBilling}
                      disabled={isLoading}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Gérer le paiement
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.location.hash = "pricing"}
                    >
                      Changer de plan
                    </Button>
                    {!currentSubscription?.cancelAtPeriodEnd && (
                      <Button
                        variant="ghost"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => setShowCancelConfirm(true)}
                      >
                        Annuler l'abonnement
                      </Button>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Usage Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Utilisation ce mois</CardTitle>
              <CardDescription>
                Suivez votre consommation de tokens et de ressources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[var(--color-muted-foreground)]">Tokens utilisés</span>
                    <span className="text-sm font-medium text-[var(--color-foreground)]">
                      {(user?.plan?.tokenLimit || 50000).toLocaleString()} / {(currentPlan?.tokenLimit || 50000).toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--color-muted)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600"
                      style={{ width: "35%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[var(--color-muted-foreground)]">Agents actifs</span>
                    <span className="text-sm font-medium text-[var(--color-foreground)]">
                      3 / {currentPlan?.agentLimit === -1 ? "∞" : currentPlan?.agentLimit || 1}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--color-muted)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-500"
                      style={{ width: currentPlan?.agentLimit === -1 ? "10%" : `${(3 / (currentPlan?.agentLimit || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Invoices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Historique des factures</CardTitle>
              <CardDescription>
                Téléchargez vos factures pour votre comptabilité
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isFree ? (
                <p className="text-center py-8 text-[var(--color-muted-foreground)]">
                  Aucune facture disponible avec le plan gratuit
                </p>
              ) : (
                <div className="space-y-2">
                  {[
                    { date: "1 janvier 2026", amount: "29,00 €", status: "Payée" },
                    { date: "1 décembre 2025", amount: "29,00 €", status: "Payée" },
                    { date: "1 novembre 2025", amount: "29,00 €", status: "Payée" },
                  ].map((invoice, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--color-muted)] transition-colors"
                    >
                      <div>
                        <p className="font-medium text-[var(--color-foreground)]">{invoice.date}</p>
                        <p className="text-sm text-[var(--color-muted-foreground)]">{invoice.amount}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-emerald-500">{invoice.status}</span>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Cancel Confirmation Modal */}
        {showCancelConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[var(--color-card)] rounded-2xl p-6 max-w-md w-full mx-4 border border-[var(--color-border)]"
            >
              <h3 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">
                Annuler l'abonnement ?
              </h3>
              <p className="text-[var(--color-muted-foreground)] mb-6">
                Vous conserverez l'accès à votre plan actuel jusqu'à la fin de la période payée.
                Vous pourrez réactiver votre abonnement à tout moment.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCancelConfirm(false)}
                >
                  Garder mon abonnement
                </Button>
                <Button
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  onClick={handleCancelSubscription}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    "Confirmer l'annulation"
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
