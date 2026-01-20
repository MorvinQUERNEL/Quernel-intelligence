// Backend API Symfony
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"

class BackendApi {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setToken(token: string | null) {
    this.token = token
  }

  getToken(): string | null {
    return this.token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Erreur HTTP ${response.status}`)
    }

    return response.json()
  }

  // === AUTH ===

  async login(email: string, password: string) {
    return this.request<{ token: string }>("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async register(data: {
    email: string
    password: string
    firstName: string
    lastName: string
  }) {
    return this.request<{
      token: string
      user: {
        id: number
        email: string
        firstName: string
        lastName: string
        plan: string
      }
      message: string
    }>("/api/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getMe() {
    return this.request<{
      id: number
      email: string
      firstName: string
      lastName: string
      plan: {
        name: string
        slug: string
        tokenLimit: number
      }
      roles: string[]
      isVerified: boolean
      createdAt: string
    }>("/api/me")
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request<{ message: string }>("/api/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    })
  }

  // === OAUTH ===

  async googleAuth(credential: string) {
    return this.request<{
      token: string
      user: {
        id: string
        email: string
        firstName: string
        lastName: string
        avatarUrl?: string
        plan: string
        authProvider: string
      }
      message: string
    }>("/api/oauth/google/callback", {
      method: "POST",
      body: JSON.stringify({ credential }),
    })
  }

  async appleAuth(idToken: string, user?: { name?: { firstName?: string; lastName?: string } }) {
    return this.request<{
      token: string
      user: {
        id: string
        email: string
        firstName: string
        lastName: string
        plan: string
        authProvider: string
      }
      message: string
    }>("/api/oauth/apple/callback", {
      method: "POST",
      body: JSON.stringify({ id_token: idToken, user }),
    })
  }

  // === CONVERSATIONS ===

  async getConversations() {
    return this.request<
      Array<{
        id: number
        title: string
        model: string
        totalTokens: number
        createdAt: string
        updatedAt: string
      }>
    >("/api/chat/conversations")
  }

  async createConversation(data: {
    title?: string
    model?: string
    agentId?: number
  }) {
    return this.request<{ id: number; title: string; model: string }>(
      "/api/chat/conversations",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    )
  }

  async getConversation(id: number) {
    return this.request<{
      id: number
      title: string
      model: string
      agent: { id: number; name: string } | null
      messages: Array<{
        id: number
        role: string
        content: string
        tokensUsed: number
        createdAt: string
      }>
      totalTokens: number
      createdAt: string
      updatedAt: string
    }>(`/api/chat/conversations/${id}`)
  }

  async sendMessage(conversationId: number, content: string) {
    return this.request<{
      userMessage: { id: number; role: string; content: string }
      assistantMessage: {
        id: number
        role: string
        content: string
        tokensUsed: number
      }
      conversation: { totalTokens: number; title: string }
    }>(`/api/chat/conversations/${conversationId}/messages`, {
      method: "POST",
      body: JSON.stringify({ content }),
    })
  }

  async deleteConversation(id: number) {
    return this.request<{ message: string }>(`/api/chat/conversations/${id}`, {
      method: "DELETE",
    })
  }

  // Streaming message - returns async generator
  async *streamMessage(
    conversationId: number,
    content: string
  ): AsyncGenerator<
    | { type: "content"; content: string }
    | { type: "done"; assistantMessageId: number; tokensUsed: number; conversationTitle: string }
    | { type: "error"; error: string },
    void,
    unknown
  > {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    const response = await fetch(
      `${this.baseUrl}/api/chat/conversations/${conversationId}/stream`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ content }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Erreur HTTP ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error("No response body")
    }

    const decoder = new TextDecoder()
    let buffer = ""

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split("\n")
      buffer = lines.pop() || ""

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6).trim()
          if (!data) continue

          try {
            const parsed = JSON.parse(data)

            if (parsed.error) {
              yield { type: "error", error: parsed.error }
              return
            }

            if (parsed.done) {
              yield {
                type: "done",
                assistantMessageId: parsed.assistantMessageId,
                tokensUsed: parsed.tokensUsed,
                conversationTitle: parsed.conversationTitle,
              }
              return
            }

            if (parsed.content) {
              yield { type: "content", content: parsed.content }
            }
          } catch {
            // Ignore parsing errors
          }
        }
      }
    }
  }

  // === AGENTS ===

  async getAgents() {
    return this.request<
      Array<{
        id: number
        name: string
        description: string
        model: string
        isPublic: boolean
      }>
    >("/api/agents")
  }

  // === PLANS ===

  async getPlans() {
    return this.request<
      Array<{
        id: number
        name: string
        slug: string
        priceMonthly: number
        priceYearly: number
        tokenLimit: number
        features: string[]
        isActive: boolean
      }>
    >("/api/plans")
  }
}

export const backendApi = new BackendApi(BACKEND_URL)
export default backendApi
