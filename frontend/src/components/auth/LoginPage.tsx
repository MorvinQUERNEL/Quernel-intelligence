import { useState, type FormEvent } from "react"
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { OAuthButtons } from "./OAuthButtons"

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<void>
  onNavigateToRegister: () => void
  onNavigateToLanding?: () => void
}

export function LoginPage({ onLogin, onNavigateToRegister, onNavigateToLanding }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await onLogin(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-secondary)] p-12 flex-col justify-between">
        <div>
          <button
            onClick={onNavigateToLanding}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <span className="text-white font-bold text-2xl">Q</span>
            </div>
            <span className="text-white font-semibold text-xl">QUERNEL INTELLIGENCE</span>
          </button>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight">
            L'IA souveraine<br />pour les entreprises<br />françaises
          </h1>
          <p className="text-white/80 text-lg max-w-md">
            Accédez à des agents IA puissants, hébergés en France,
            sans dépendance aux APIs américaines.
          </p>
          <div className="flex gap-4">
            {["RGPD", "Souveraineté", "Performance"].map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full bg-white/10 backdrop-blur text-white text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="text-white/60 text-sm">
          © 2026 QUERNEL INTELLIGENCE - Tous droits réservés
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[var(--color-background)]">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <button
              onClick={onNavigateToLanding}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
                <span className="text-white font-bold text-xl">Q</span>
              </div>
              <span className="font-semibold text-xl text-[var(--color-foreground)]">QUERNEL</span>
            </button>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
              Connexion
            </h2>
            <p className="mt-2 text-[var(--color-muted-foreground)]">
              Accédez à votre espace QUERNEL IA
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-lg bg-[var(--color-destructive)]/10 border border-[var(--color-destructive)]/20">
                <p className="text-sm text-[var(--color-destructive)]">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-foreground)]">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-muted-foreground)]" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[var(--color-foreground)]">
                    Mot de passe
                  </label>
                  <button
                    type="button"
                    className="text-sm text-[var(--color-primary)] hover:underline"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-muted-foreground)]" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--color-border)]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[var(--color-background)] px-2 text-[var(--color-muted-foreground)]">
                  ou continuez avec
                </span>
              </div>
            </div>

            <OAuthButtons
              onError={(err) => setError(err)}
            />
          </form>

          {/* Test Credentials */}
          <div className="p-4 rounded-lg bg-[var(--color-muted)] border border-[var(--color-border)]">
            <p className="text-xs font-medium text-[var(--color-muted-foreground)] mb-3 uppercase tracking-wide">
              Comptes de test
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setEmail("admin@quernel-intelligence.com")
                  setPassword("admin123")
                }}
                className="w-full flex items-center justify-between p-2 rounded-md bg-[var(--color-background)] hover:bg-[var(--color-accent)]/10 transition-colors text-left"
              >
                <div>
                  <span className="text-xs font-medium text-[var(--color-primary)]">Admin</span>
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    admin@quernel-intelligence.com
                  </p>
                </div>
                <span className="text-xs text-[var(--color-muted-foreground)] font-mono">
                  admin123
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("user@test.com")
                  setPassword("user123")
                }}
                className="w-full flex items-center justify-between p-2 rounded-md bg-[var(--color-background)] hover:bg-[var(--color-accent)]/10 transition-colors text-left"
              >
                <div>
                  <span className="text-xs font-medium text-[var(--color-secondary)]">User</span>
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    user@test.com
                  </p>
                </div>
                <span className="text-xs text-[var(--color-muted-foreground)] font-mono">
                  user123
                </span>
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-[var(--color-muted-foreground)]">
            Pas encore de compte ?{" "}
            <button
              onClick={onNavigateToRegister}
              className="text-[var(--color-primary)] hover:underline font-medium"
            >
              Créer un compte
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
