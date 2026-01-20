import { useState, useEffect, useMemo } from "react"
import { Layout } from "@/components/layout/Layout"
import { ChatInterface } from "@/components/chat/ChatInterface"
import { Dashboard } from "@/components/dashboard/Dashboard"
import { LoginPage } from "@/components/auth/LoginPage"
import { RegisterPage } from "@/components/auth/RegisterPage"
import { LandingPage } from "@/components/landing/LandingPage"
import { useAuthStore } from "@/stores/authStore"

type AppView = "landing" | "login" | "register" | "app"

function App() {
  const [currentPath, setCurrentPath] = useState("/chat")
  const [hashView, setHashView] = useState<"login" | "register" | null>(null)

  const { isAuthenticated, isLoading, login, register, checkAuth } = useAuthStore()

  // Check auth on mount
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Handle URL hash for navigation (allows direct linking)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (hash === "login") {
        setHashView("login")
      } else if (hash === "register") {
        setHashView("register")
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

  // Show landing page for non-authenticated users
  if (appView === "landing") {
    return (
      <LandingPage
        onNavigateToLogin={handleNavigateToLogin}
        onNavigateToRegister={handleNavigateToRegister}
      />
    )
  }

  // Show login page
  if (appView === "login") {
    return (
      <LoginPage
        onLogin={login}
        onNavigateToRegister={handleNavigateToRegister}
        onNavigateToLanding={handleNavigateToLanding}
      />
    )
  }

  // Show register page
  if (appView === "register") {
    return (
      <RegisterPage
        onRegister={register}
        onNavigateToLogin={handleNavigateToLogin}
        onNavigateToLanding={handleNavigateToLanding}
      />
    )
  }

  // Render main app page based on current path
  const renderPage = () => {
    switch (currentPath) {
      case "/chat":
        return <ChatInterface />
      case "/dashboard":
        return <Dashboard />
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
    <Layout currentPath={currentPath} onNavigate={setCurrentPath}>
      {renderPage()}
    </Layout>
  )
}

export default App
