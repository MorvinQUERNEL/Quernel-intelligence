import { create } from "zustand"
import { backendApi } from "../services/backend"

export interface Plan {
  id: number
  name: string
  slug: string
  priceMonthly: number
  priceYearly: number
  tokenLimit: number
  agentLimit: number
  documentLimit: number
  features: string[]
  isPopular?: boolean
  isEnterprise?: boolean
}

export interface Subscription {
  id: string
  planSlug: string
  status: "active" | "canceled" | "past_due" | "trialing"
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  interval: "monthly" | "yearly"
}

interface SubscriptionState {
  plans: Plan[]
  currentSubscription: Subscription | null
  isLoading: boolean
  error: string | null

  // Actions
  loadPlans: () => Promise<void>
  loadSubscription: () => Promise<void>
  createCheckoutSession: (planSlug: string, interval: "monthly" | "yearly") => Promise<string>
  createPortalSession: () => Promise<string>
  cancelSubscription: () => Promise<void>
  resumeSubscription: () => Promise<void>
}

// Default plans for display when API is unavailable
// Architecture v7: Un seul plan Pro a 50€/mois avec 7 jours d'essai gratuit
const defaultPlans: Plan[] = [
  {
    id: 1,
    name: "Essai Gratuit",
    slug: "free",
    priceMonthly: 0,
    priceYearly: 0,
    tokenLimit: 100000,
    agentLimit: 3,
    documentLimit: 10,
    features: [
      "3 Anges IA (Raphael, Gabriel, Michael)",
      "7 jours d'essai complet",
      "100 000 tokens",
      "10 documents",
      "Support email",
    ],
  },
  {
    id: 2,
    name: "Pro",
    slug: "pro",
    priceMonthly: 50,
    priceYearly: 480,
    tokenLimit: 2000000,
    agentLimit: 3,
    documentLimit: 100,
    features: [
      "3 Anges IA experts",
      "Contexte partage entre anges",
      "2M tokens/mois",
      "100 documents",
      "Historique illimite",
      "Support prioritaire",
      "API access",
      "Exports avances",
    ],
    isPopular: true,
  },
]

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  plans: defaultPlans,
  currentSubscription: null,
  isLoading: false,
  error: null,

  loadPlans: async () => {
    set({ isLoading: true, error: null })
    try {
      const plans = await backendApi.getPlans()
      // Merge with default plans to ensure we have all display data
      const enrichedPlans = plans.map((plan) => {
        const defaultPlan = defaultPlans.find((p) => p.slug === plan.slug)
        return {
          ...plan,
          agentLimit: defaultPlan?.agentLimit ?? 1,
          documentLimit: defaultPlan?.documentLimit ?? 5,
          isPopular: plan.slug === "pro",
          isEnterprise: plan.slug === "enterprise",
        }
      })
      set({ plans: enrichedPlans.length > 0 ? enrichedPlans : defaultPlans, isLoading: false })
    } catch (error) {
      console.error("Error loading plans:", error)
      set({ error: "Erreur lors du chargement des plans", isLoading: false })
    }
  },

  loadSubscription: async () => {
    set({ isLoading: true, error: null })
    try {
      const subscription = await backendApi.getSubscription()
      set({ currentSubscription: subscription, isLoading: false })
    } catch (error) {
      console.error("Error loading subscription:", error)
      set({ currentSubscription: null, isLoading: false })
    }
  },

  createCheckoutSession: async (planSlug: string, interval: "monthly" | "yearly") => {
    set({ isLoading: true, error: null })
    try {
      const response = await backendApi.createCheckoutSession(planSlug, interval)
      set({ isLoading: false })
      return response.url
    } catch (error) {
      console.error("Error creating checkout session:", error)
      set({ error: "Erreur lors de la création de la session de paiement", isLoading: false })
      throw error
    }
  },

  createPortalSession: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await backendApi.createPortalSession()
      set({ isLoading: false })
      return response.url
    } catch (error) {
      console.error("Error creating portal session:", error)
      set({ error: "Erreur lors de l'accès au portail", isLoading: false })
      throw error
    }
  },

  cancelSubscription: async () => {
    set({ isLoading: true, error: null })
    try {
      await backendApi.cancelSubscription()
      const subscription = get().currentSubscription
      if (subscription) {
        set({
          currentSubscription: { ...subscription, cancelAtPeriodEnd: true },
          isLoading: false,
        })
      }
    } catch (error) {
      console.error("Error canceling subscription:", error)
      set({ error: "Erreur lors de l'annulation", isLoading: false })
      throw error
    }
  },

  resumeSubscription: async () => {
    set({ isLoading: true, error: null })
    try {
      await backendApi.resumeSubscription()
      const subscription = get().currentSubscription
      if (subscription) {
        set({
          currentSubscription: { ...subscription, cancelAtPeriodEnd: false },
          isLoading: false,
        })
      }
    } catch (error) {
      console.error("Error resuming subscription:", error)
      set({ error: "Erreur lors de la réactivation", isLoading: false })
      throw error
    }
  },
}))
