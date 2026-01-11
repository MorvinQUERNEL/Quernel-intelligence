import { create } from "zustand"
import { persist } from "zustand/middleware"
import { backendApi } from "../services/backend"

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

          set({
            user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
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

          set({
            user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        backendApi.setToken(null)
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
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

        if (!token) {
          set({ isAuthenticated: false, user: null })
          return
        }

        try {
          // Restaurer le token dans l'API client
          backendApi.setToken(token)

          // Valider le token en récupérant l'utilisateur
          const user = await backendApi.getMe()

          set({
            user,
            isAuthenticated: true,
          })
        } catch {
          backendApi.setToken(null)
          set({ isAuthenticated: false, user: null, token: null })
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
