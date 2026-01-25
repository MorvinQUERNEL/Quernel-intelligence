import { create } from "zustand"
import { persist } from "zustand/middleware"
import { backendApi } from "../services/backend"
import { toast } from "./toastStore"

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  avatarUrl?: string
  plan: {
    name: string
    slug: string
    tokenLimit: number
  }
  roles: string[]
  isVerified: boolean
  createdAt: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean

  // Actions
  login: (email: string, password: string) => Promise<void>
  register: (data: {
    email: string
    password: string
    firstName: string
    lastName: string
  }) => Promise<void>
  loginWithGoogle: (credential: string) => Promise<void>
  loginWithApple: (idToken: string, user?: { name?: { firstName?: string; lastName?: string } }) => Promise<void>
  logout: () => void
  updateUser: (user: Partial<User>) => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })

        try {
          // Appel à l'API Symfony
          const response = await backendApi.login(email, password)

          // Stocker le token
          backendApi.setToken(response.token)

          // Récupérer les infos utilisateur
          const user = await backendApi.getMe()

          // Définir le userId pour l'API IA
          backendApi.setUserId(user.id.toString())

          set({
            user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          })

          toast.success("Connexion reussie", `Bienvenue ${user.firstName} !`)
        } catch (error) {
          set({ isLoading: false })
          const message = error instanceof Error ? error.message : "Email ou mot de passe incorrect"
          toast.error("Echec de connexion", message)
          throw error
        }
      },

      register: async (data) => {
        set({ isLoading: true })

        try {
          // Appel à l'API Symfony
          const response = await backendApi.register(data)

          // Stocker le token
          backendApi.setToken(response.token)

          // Récupérer les infos utilisateur complètes
          const user = await backendApi.getMe()

          // Définir le userId pour l'API IA
          backendApi.setUserId(user.id.toString())

          set({
            user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          })

          toast.success("Compte cree", `Bienvenue ${user.firstName} ! Votre essai gratuit de 7 jours commence maintenant.`)
        } catch (error) {
          set({ isLoading: false })
          const message = error instanceof Error ? error.message : "Erreur lors de l'inscription"
          toast.error("Echec de l'inscription", message)
          throw error
        }
      },

      loginWithGoogle: async (credential: string) => {
        set({ isLoading: true })

        try {
          const response = await backendApi.googleAuth(credential)

          backendApi.setToken(response.token)
          const user = await backendApi.getMe()

          // Définir le userId pour l'API IA
          backendApi.setUserId(user.id.toString())

          set({
            user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          })

          toast.success("Connexion reussie", `Bienvenue ${user.firstName} !`)
        } catch (error) {
          set({ isLoading: false })
          toast.error("Echec de connexion Google", "Une erreur est survenue lors de la connexion avec Google")
          throw error
        }
      },

      loginWithApple: async (idToken: string, userInfo?: { name?: { firstName?: string; lastName?: string } }) => {
        set({ isLoading: true })

        try {
          const response = await backendApi.appleAuth(idToken, userInfo)

          backendApi.setToken(response.token)
          const user = await backendApi.getMe()

          // Définir le userId pour l'API IA
          backendApi.setUserId(user.id.toString())

          set({
            user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          })

          toast.success("Connexion reussie", `Bienvenue ${user.firstName} !`)
        } catch (error) {
          set({ isLoading: false })
          toast.error("Echec de connexion Apple", "Une erreur est survenue lors de la connexion avec Apple")
          throw error
        }
      },

      logout: () => {
        backendApi.setToken(null)
        backendApi.setUserId(null)
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
        toast.info("Deconnexion", "Vous avez ete deconnecte avec succes")
      },

      updateUser: (userData) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          })
        }
      },

      checkAuth: async () => {
        const token = get().token
        const wasAuthenticated = get().isAuthenticated

        if (!token) {
          set({ isAuthenticated: false, user: null })
          return
        }

        try {
          // Restaurer le token dans l'API client
          backendApi.setToken(token)

          // Valider le token en récupérant l'utilisateur
          const user = await backendApi.getMe()

          // Définir le userId pour l'API IA
          backendApi.setUserId(user.id.toString())

          set({
            user,
            isAuthenticated: true,
          })
        } catch {
          backendApi.setToken(null)
          backendApi.setUserId(null)
          set({ isAuthenticated: false, user: null, token: null })

          // Only show session expired toast if user was previously authenticated
          if (wasAuthenticated) {
            toast.warning("Session expiree", "Veuillez vous reconnecter")
          }
        }
      },
    }),
    {
      name: "quernel-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Restaurer le token dans l'API client après réhydratation
        if (state?.token) {
          backendApi.setToken(state.token)
        }
      },
    }
  )
)
