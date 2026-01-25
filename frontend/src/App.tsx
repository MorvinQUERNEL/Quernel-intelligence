import { useState, useEffect, useMemo } from "react"
import { Layout } from "@/components/layout/Layout"
import { ChatInterface } from "@/components/chat/ChatInterface"
import { Dashboard } from "@/components/dashboard/Dashboard"
import { AdminDashboard } from "@/components/admin/AdminDashboard"
import { LoginPage } from "@/components/auth/LoginPage"
import { RegisterPage } from "@/components/auth/RegisterPage"
import { BetaAccessGate } from "@/components/auth/BetaAccessGate"
import { LandingPage } from "@/components/landing/LandingPage"
import { PricingPage } from "@/components/pricing/PricingPage"
import { BillingPage } from "@/components/billing/BillingPage"
import { PrivacyPolicy } from "@/components/legal/PrivacyPolicy"
import { TermsOfService } from "@/components/legal/TermsOfService"
import { LegalMentions } from "@/components/legal/LegalMentions"
import { CookiePolicy } from "@/components/legal/CookiePolicy"
import { CookieConsent } from "@/components/cookies/CookieConsent"
import { CookiePreferences } from "@/components/cookies/CookiePreferences"
import { ToastContainer } from "@/components/ui/Toast"
import { useAuthStore } from "@/stores/authStore"

type AppView = "landing" | "login" | "register" | "pricing" | "privacy" | "terms" | "legal" | "cookies" | "app"

function AppContent() {
  const [currentPath, setCurrentPath] = useState("/chat")
  const [hashView, setHashView] = useState<string | null>(null)

  const { isAuthenticated, isLoading, login, register, checkAuth } = useAuthStore()

  // Check auth on mount
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Handle URL hash for navigation (allows direct linking)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) // Remove the #

      // Handle checkout return URLs
      if (hash.includes("checkout=success")) {
        // TODO: Show success message
        window.location.hash = ""
        return
      }
      if (hash.includes("checkout=cancel")) {
        // TODO: Show cancel message
        window.location.hash = ""
        return
      }

      if (hash === "login") {
        setHashView("login")
      } else if (hash === "register") {
        setHashView("register")
      } else if (hash === "pricing") {
        setHashView("pricing")
      } else if (hash === "privacy") {
        setHashView("privacy")
      } else if (hash === "terms") {
        setHashView("terms")
      } else if (hash === "legal") {
        setHashView("legal")
      } else if (hash === "cookies") {
        setHashView("cookies")
      } else {
        setHashView(null)
      }
    }

    handleHashChange()
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  // Compute the current view based on auth state and hash
  const appView = useMemo<AppView>(() => {
    // Legal pages are accessible regardless of auth state
    if (hashView === "privacy") return "privacy"
    if (hashView === "terms") return "terms"
    if (hashView === "legal") return "legal"
    if (hashView === "cookies") return "cookies"
    if (hashView === "pricing") return "pricing"

    if (isAuthenticated) {
      return "app"
    }
    if (hashView === "login") {
      return "login"
    }
    if (hashView === "register") {
      return "register"
    }
    return "landing"
  }, [isAuthenticated, hashView])

  // Check dark mode preference for cookie consent
  const isDark = useMemo(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark")
    }
    return true // Default to dark
  }, [appView])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-xl">Q</span>
          </div>
          <p className="text-[var(--color-muted-foreground)]">Chargement...</p>
        </div>
      </div>
    )
  }

  // Navigation handlers
  const handleNavigateToLogin = () => {
    window.location.hash = "login"
  }

  const handleNavigateToRegister = () => {
    window.location.hash = "register"
  }

  const handleNavigateToLanding = () => {
    window.location.hash = ""
  }

  // Show privacy policy page
  if (appView === "privacy") {
    return (
      <>
        <PrivacyPolicy onNavigateBack={handleNavigateToLanding} />
        <CookieConsent isDark={isDark} />
        <CookiePreferences isDark={isDark} />
        <ToastContainer />
      </>
    )
  }

  // Show terms of service page
  if (appView === "terms") {
    return (
      <>
        <TermsOfService onNavigateBack={handleNavigateToLanding} />
        <CookieConsent isDark={isDark} />
        <CookiePreferences isDark={isDark} />
        <ToastContainer />
      </>
    )
  }

  // Show legal mentions page
  if (appView === "legal") {
    return (
      <>
        <LegalMentions onNavigateBack={handleNavigateToLanding} />
        <CookieConsent isDark={isDark} />
        <CookiePreferences isDark={isDark} />
        <ToastContainer />
      </>
    )
  }

  // Show cookie policy page
  if (appView === "cookies") {
    return (
      <>
        <CookiePolicy onNavigateBack={handleNavigateToLanding} />
        <CookieConsent isDark={isDark} />
        <CookiePreferences isDark={isDark} />
        <ToastContainer />
      </>
    )
  }

  // Show pricing page
  if (appView === "pricing") {
    return (
      <>
        <PricingPage
          onNavigateBack={handleNavigateToLanding}
          onNavigateToRegister={handleNavigateToRegister}
        />
        <CookieConsent isDark={isDark} />
        <CookiePreferences isDark={isDark} />
        <ToastContainer />
      </>
    )
  }

  // Show landing page for non-authenticated users
  if (appView === "landing") {
    return (
      <>
        <LandingPage
          onNavigateToLogin={handleNavigateToLogin}
          onNavigateToRegister={handleNavigateToRegister}
        />
        <CookieConsent isDark={isDark} />
        <CookiePreferences isDark={isDark} />
        <ToastContainer />
      </>
    )
  }

  // Show login page
  if (appView === "login") {
    return (
      <>
        <LoginPage
          onLogin={login}
          onNavigateToRegister={handleNavigateToRegister}
          onNavigateToLanding={handleNavigateToLanding}
        />
        <CookieConsent isDark={isDark} />
        <CookiePreferences isDark={isDark} />
        <ToastContainer />
      </>
    )
  }

  // Show register page
  if (appView === "register") {
    return (
      <>
        <RegisterPage
          onRegister={register}
          onNavigateToLogin={handleNavigateToLogin}
          onNavigateToLanding={handleNavigateToLanding}
        />
        <CookieConsent isDark={isDark} />
        <CookiePreferences isDark={isDark} />
        <ToastContainer />
      </>
    )
  }

  // Check if user is admin
  const { user } = useAuthStore()
  const isAdmin = user?.roles?.includes("ROLE_ADMIN") || false

  // Render main app page based on current path
  const renderPage = () => {
    switch (currentPath) {
      case "/chat":
        return <ChatInterface />
      case "/dashboard":
        return <Dashboard />
      case "/billing":
        return <BillingPage />
      case "/admin":
        // Only allow admin access
        if (isAdmin) {
          return <AdminDashboard onNavigateToChat={() => setCurrentPath("/chat")} />
        }
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">
                Acces refuse
              </h2>
              <p className="text-[var(--color-muted-foreground)]">
                Vous n'avez pas les droits pour acceder a cette page.
              </p>
            </div>
          </div>
        )
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">
                Page en construction
              </h2>
              <p className="text-[var(--color-muted-foreground)]">
                Cette fonctionnalité sera bientôt disponible.
              </p>
            </div>
          </div>
        )
    }
  }

  return (
    <>
      <Layout currentPath={currentPath} onNavigate={setCurrentPath}>
        {renderPage()}
      </Layout>
      <CookieConsent isDark={false} />
      <CookiePreferences isDark={false} />
      <ToastContainer />
    </>
  )
}

function App() {
  return (
    <BetaAccessGate>
      <AppContent />
    </BetaAccessGate>
  )
}

export default App
