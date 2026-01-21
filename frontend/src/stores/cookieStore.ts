import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CookiePreferences {
  essential: boolean // Always true, cannot be disabled
  functional: boolean
  analytics: boolean
}

interface CookieState {
  hasConsented: boolean
  preferences: CookiePreferences
  showBanner: boolean
  showPreferences: boolean

  // Actions
  acceptAll: () => void
  rejectAll: () => void
  savePreferences: (preferences: Partial<CookiePreferences>) => void
  openPreferences: () => void
  closePreferences: () => void
  closeBanner: () => void
  resetConsent: () => void
}

const defaultPreferences: CookiePreferences = {
  essential: true, // Always required
  functional: true, // Default to true for better UX
  analytics: false, // Requires explicit consent
}

export const useCookieStore = create<CookieState>()(
  persist(
    (set, get) => ({
      hasConsented: false,
      preferences: defaultPreferences,
      showBanner: true,
      showPreferences: false,

      acceptAll: () => {
        set({
          hasConsented: true,
          showBanner: false,
          preferences: {
            essential: true,
            functional: true,
            analytics: true,
          },
        })
        // Here you would initialize analytics if accepted
        initAnalytics(true)
      },

      rejectAll: () => {
        set({
          hasConsented: true,
          showBanner: false,
          preferences: {
            essential: true,
            functional: false,
            analytics: false,
          },
        })
        // Disable analytics
        initAnalytics(false)
      },

      savePreferences: (newPreferences) => {
        const currentPreferences = get().preferences
        const updatedPreferences = {
          ...currentPreferences,
          ...newPreferences,
          essential: true, // Always keep essential enabled
        }
        set({
          hasConsented: true,
          showBanner: false,
          showPreferences: false,
          preferences: updatedPreferences,
        })
        // Initialize or disable analytics based on preference
        initAnalytics(updatedPreferences.analytics)
      },

      openPreferences: () => {
        set({ showPreferences: true })
      },

      closePreferences: () => {
        set({ showPreferences: false })
      },

      closeBanner: () => {
        set({ showBanner: false })
      },

      resetConsent: () => {
        set({
          hasConsented: false,
          showBanner: true,
          preferences: defaultPreferences,
        })
        // Clear analytics
        initAnalytics(false)
      },
    }),
    {
      name: "quernel-cookies",
      partialize: (state) => ({
        hasConsented: state.hasConsented,
        preferences: state.preferences,
      }),
      onRehydrateStorage: () => (state) => {
        // On rehydrate, determine if banner should be shown
        if (state && state.hasConsented) {
          state.showBanner = false
          // Re-initialize analytics based on saved preference
          initAnalytics(state.preferences.analytics)
        }
      },
    }
  )
)

// Helper function to initialize/disable analytics
function initAnalytics(enabled: boolean) {
  if (typeof window === "undefined") return

  if (enabled) {
    // Initialize Google Analytics or other analytics
    // This is where you would add your GA initialization code
    console.log("Analytics enabled")
    // Example:
    // if (window.gtag) {
    //   window.gtag('consent', 'update', {
    //     analytics_storage: 'granted'
    //   })
    // }
  } else {
    // Disable analytics
    console.log("Analytics disabled")
    // Example:
    // if (window.gtag) {
    //   window.gtag('consent', 'update', {
    //     analytics_storage: 'denied'
    //   })
    // }
  }
}
