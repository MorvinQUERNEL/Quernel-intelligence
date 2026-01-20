import { useState, useEffect, useCallback } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useAuthStore } from "@/stores/authStore"

// Google Client ID - should be moved to environment variable
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ""

// Apple Client ID - should be moved to environment variable
const APPLE_CLIENT_ID = import.meta.env.VITE_APPLE_CLIENT_ID || ""
const APPLE_REDIRECT_URI = import.meta.env.VITE_APPLE_REDIRECT_URI || window.location.origin

interface OAuthButtonsProps {
  onError?: (error: string) => void
  onSuccess?: () => void
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string
            callback: (response: { credential: string }) => void
            auto_select?: boolean
          }) => void
          renderButton: (
            element: HTMLElement,
            options: {
              type?: "standard" | "icon"
              theme?: "outline" | "filled_blue" | "filled_black"
              size?: "large" | "medium" | "small"
              text?: "signin_with" | "signup_with" | "continue_with" | "signin"
              shape?: "rectangular" | "pill" | "circle" | "square"
              logo_alignment?: "left" | "center"
              width?: number
              locale?: string
            }
          ) => void
          prompt: () => void
        }
      }
    }
    AppleID?: {
      auth: {
        init: (config: {
          clientId: string
          scope: string
          redirectURI: string
          state?: string
          usePopup?: boolean
        }) => void
        signIn: () => Promise<{
          authorization: {
            code: string
            id_token: string
            state?: string
          }
          user?: {
            email?: string
            name?: {
              firstName?: string
              lastName?: string
            }
          }
        }>
      }
    }
  }
}

export function OAuthButtons({ onError, onSuccess }: OAuthButtonsProps) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isAppleLoading, setIsAppleLoading] = useState(false)
  const [isGoogleReady, setIsGoogleReady] = useState(false)
  const [isAppleReady, setIsAppleReady] = useState(false)

  const { loginWithGoogle, loginWithApple } = useAuthStore()

  // Handle Google credential response
  const handleGoogleResponse = useCallback(async (response: { credential: string }) => {
    setIsGoogleLoading(true)
    try {
      await loginWithGoogle(response.credential)
      onSuccess?.()
    } catch (error) {
      onError?.(error instanceof Error ? error.message : "Erreur de connexion Google")
    } finally {
      setIsGoogleLoading(false)
    }
  }, [loginWithGoogle, onSuccess, onError])

  // Load Google Sign-In SDK
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.warn("Google Client ID not configured")
      return
    }

    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        })
        setIsGoogleReady(true)
      }
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [handleGoogleResponse])

  // Load Apple Sign-In SDK
  useEffect(() => {
    if (!APPLE_CLIENT_ID) {
      console.warn("Apple Client ID not configured")
      return
    }

    const script = document.createElement("script")
    script.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
    script.async = true
    script.onload = () => {
      if (window.AppleID) {
        window.AppleID.auth.init({
          clientId: APPLE_CLIENT_ID,
          scope: "name email",
          redirectURI: APPLE_REDIRECT_URI,
          usePopup: true,
        })
        setIsAppleReady(true)
      }
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  // Handle Google Sign-In click
  const handleGoogleClick = () => {
    if (!isGoogleReady || !window.google) {
      onError?.("Google Sign-In n'est pas disponible")
      return
    }

    // Trigger Google One Tap or redirect
    window.google.accounts.id.prompt()
  }

  // Handle Apple Sign-In click
  const handleAppleClick = async () => {
    if (!isAppleReady || !window.AppleID) {
      onError?.("Apple Sign-In n'est pas disponible")
      return
    }

    setIsAppleLoading(true)
    try {
      const response = await window.AppleID.auth.signIn()
      await loginWithApple(response.authorization.id_token, response.user)
      onSuccess?.()
    } catch (error) {
      // User cancelled or error occurred
      if (error instanceof Error && !error.message.includes("popup_closed")) {
        onError?.(error.message || "Erreur de connexion Apple")
      }
    } finally {
      setIsAppleLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Google Button */}
      <Button
        variant="outline"
        type="button"
        className="w-full"
        onClick={handleGoogleClick}
        disabled={isGoogleLoading || (!isGoogleReady && !!GOOGLE_CLIENT_ID)}
      >
        {isGoogleLoading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        Google
      </Button>

      {/* Apple Button */}
      <Button
        variant="outline"
        type="button"
        className="w-full"
        onClick={handleAppleClick}
        disabled={isAppleLoading || (!isAppleReady && !!APPLE_CLIENT_ID)}
      >
        {isAppleLoading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
          </svg>
        )}
        Apple
      </Button>
    </div>
  )
}

// Simple fallback buttons for when OAuth is not configured
export function OAuthButtonsFallback() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button variant="outline" type="button" className="w-full" disabled>
        <svg className="w-5 h-5 mr-2 opacity-50" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Google
      </Button>
      <Button variant="outline" type="button" className="w-full" disabled>
        <svg className="w-5 h-5 mr-2 opacity-50" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
        </svg>
        Apple
      </Button>
    </div>
  )
}
