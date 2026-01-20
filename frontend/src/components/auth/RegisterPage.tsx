import { useState, type FormEvent } from "react"
import { Eye, EyeOff, Mail, Lock, User, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { cn } from "@/lib/utils"

interface RegisterPageProps {
  onRegister: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>
  onNavigateToLogin: () => void
  onNavigateToLanding?: () => void
}

export function RegisterPage({ onRegister, onNavigateToLogin, onNavigateToLanding }: RegisterPageProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [acceptTerms, setAcceptTerms] = useState(false)

  // Password strength check
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  }
  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    if (passwordStrength < 3) {
      setError("Le mot de passe n'est pas assez fort")
      return
    }

    if (!acceptTerms) {
      setError("Vous devez accepter les conditions d'utilisation")
      return
    }

    setIsLoading(true)

    try {
      await onRegister({ email, password, firstName, lastName })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'inscription")
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
            Rejoignez la révolution<br />de l'IA souveraine
          </h1>
          <p className="text-white/80 text-lg max-w-md">
            Créez votre compte et accédez immédiatement à des agents IA puissants,
            100% hébergés en France.
          </p>
          <div className="space-y-3">
            {[
              "10 000 tokens gratuits par mois",
              "Aucune carte bancaire requise",
              "Données hébergées en France",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-white/90">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                {feature}
              </div>
            ))}
          </div>
        </div>

        <div className="text-white/60 text-sm">
          © 2026 QUERNEL INTELLIGENCE - Tous droits réservés
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[var(--color-background)] overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
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
              Créer un compte
            </h2>
            <p className="mt-2 text-[var(--color-muted-foreground)]">
              Commencez gratuitement avec 10K tokens/mois
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 rounded-lg bg-[var(--color-destructive)]/10 border border-[var(--color-destructive)]/20">
                <p className="text-sm text-[var(--color-destructive)]">{error}</p>
              </div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-foreground)]">
                  Prénom
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-muted-foreground)]" />
                  <Input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jean"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-foreground)]">
                  Nom
                </label>
                <Input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Dupont"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--color-foreground)]">
                Email professionnel
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-muted-foreground)]" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@entreprise.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--color-foreground)]">
                Mot de passe
              </label>
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
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Password strength indicator */}
              {password && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={cn(
                          "h-1 flex-1 rounded-full transition-colors",
                          passwordStrength >= level
                            ? level <= 1
                              ? "bg-[var(--color-destructive)]"
                              : level <= 2
                              ? "bg-yellow-500"
                              : "bg-[var(--color-secondary)]"
                            : "bg-[var(--color-muted)]"
                        )}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { key: "length", label: "8 caractères min" },
                      { key: "uppercase", label: "Une majuscule" },
                      { key: "lowercase", label: "Une minuscule" },
                      { key: "number", label: "Un chiffre" },
                    ].map(({ key, label }) => (
                      <div
                        key={key}
                        className={cn(
                          "flex items-center gap-1",
                          passwordChecks[key as keyof typeof passwordChecks]
                            ? "text-[var(--color-secondary)]"
                            : "text-[var(--color-muted-foreground)]"
                        )}
                      >
                        <Check className="w-3 h-3" />
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--color-foreground)]">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-muted-foreground)]" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn(
                    "pl-10",
                    confirmPassword && password !== confirmPassword && "border-[var(--color-destructive)]"
                  )}
                  required
                />
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-ring)]"
              />
              <label htmlFor="terms" className="text-sm text-[var(--color-muted-foreground)]">
                J'accepte les{" "}
                <a href="#" className="text-[var(--color-primary)] hover:underline">
                  conditions d'utilisation
                </a>{" "}
                et la{" "}
                <a href="#" className="text-[var(--color-primary)] hover:underline">
                  politique de confidentialité
                </a>
              </label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Création du compte...
                </>
              ) : (
                "Créer mon compte gratuit"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-[var(--color-muted-foreground)]">
            Déjà un compte ?{" "}
            <button
              onClick={onNavigateToLogin}
              className="text-[var(--color-primary)] hover:underline font-medium"
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
