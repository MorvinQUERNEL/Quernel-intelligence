import { useState, useEffect } from "react"
import { Layout } from "@/components/layout/Layout"
import { ChatInterface } from "@/components/chat/ChatInterface"
import { Dashboard } from "@/components/dashboard/Dashboard"
import { LoginPage } from "@/components/auth/LoginPage"
import { RegisterPage } from "@/components/auth/RegisterPage"
import { useAuthStore } from "@/stores/authStore"

type AuthView = "login" | "register"

function App() {
  const [currentPath, setCurrentPath] = useState("/chat")
  const [authView, setAuthView] = useState<AuthView>("login")

  const { isAuthenticated, isLoading, login, register, checkAuth } = useAuthStore()

  // Check auth on mount
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

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

  // Show auth pages if not authenticated
  if (!isAuthenticated) {
    if (authView === "login") {
      return (
        <LoginPage
          onLogin={login}
          onNavigateToRegister={() => setAuthView("register")}
        />
      )
    }

    return (
      <RegisterPage
        onRegister={register}
        onNavigateToLogin={() => setAuthView("login")}
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
