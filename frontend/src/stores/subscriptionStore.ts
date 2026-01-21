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
const defaultPlans: Plan[] = [
  {
    id: 1,
    name: "Gratuit",
    slug: "free",
    priceMonthly: 0,
    priceYearly: 0,
    tokenLimit: 50000,
    agentLimit: 1,
    documentLimit: 5,
    features: [
      "1 agent IA",
      "50 000 tokens/mois",
      "5 documents",
      "Support email",
    ],
  },
  {
    id: 2,
    name: "Pro",
    slug: "pro",
    priceMonthly: 29,
    priceYearly: 290,
    tokenLimit: 500000,
    agentLimit: 5,
    documentLimit: 50,
    features: [
      "5 agents IA",
      "500 000 tokens/mois",
      "50 documents",
      "Support prioritaire",
      "API access",
      "Exports avancés",
    ],
    isPopular: true,
  },
  {
    id: 3,
    name: "Business",
    slug: "business",
    priceMonthly: 99,
    priceYearly: 990,
    tokenLimit: 2000000,
    agentLimit: 20,
    documentLimit: 200,
    features: [
      "20 agents IA",
      "2M tokens/mois",
      "200 documents",
      "Support prioritaire 24/7",
      "API illimitée",
      "Intégrations avancées",
      "Équipe (5 membres)",
    ],
  },
  {
    id: 4,
    name: "Enterprise",
    slug: "enterprise",
    priceMonthly: -1, // Contact
    priceYearly: -1,
    tokenLimit: -1, // Unlimited
    agentLimit: -1,
    documentLimit: -1,
    features: [
      "Agents illimités",
      "Tokens illimités",
      "Documents illimités",
      "Support dédié",
      "SLA garanti",
      "On-premise disponible",
      "Formation personnalisée",
      "Équipe illimitée",
    ],
    isEnterprise: true,
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
