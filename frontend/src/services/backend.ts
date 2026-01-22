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

  // === AI DEMO (Public endpoint) ===

  /**
   * Call the demo chat endpoint (public, no auth required)
   * Uses Symfony backend which proxies to vLLM
   */
  async callDemoChat(message: string, agentId?: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/demo/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          agentId: agentId || "charly",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Erreur HTTP ${response.status}`)
      }

      const data = await response.json()
      return data.response || "Désolé, je n'ai pas pu générer de réponse."
    } catch (error) {
      console.error("Demo chat error:", error)
      throw error
    }
  }

  /**
   * Check if the demo endpoint is available
   */
  async checkDemoHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/demo/health`, {
        method: "GET",
      })
      return response.ok
    } catch {
      return false
    }
  }

  // === WEBHOOK AI (Flask on RunPod) ===

  async callAIWebhook(message: string, agentId?: string, _systemPrompt?: string): Promise<string> {
    // Primary: Flask webhook on RunPod (set up by Terminal 2)
    const webhookUrl = import.meta.env.VITE_AI_WEBHOOK_URL || "http://localhost:5680/webhook/chat"

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          agentId: agentId || "charly",
          userId: this.token ? "authenticated" : "anonymous",
          timestamp: new Date().toISOString()
        }),
      })

      if (!response.ok) {
        throw new Error(`Webhook error: ${response.status}`)
      }

      const data = await response.json()

      // Handle different response formats
      if (typeof data === "string") {
        return data
      }
      // Handle array response: [{"response": "..."}]
      if (Array.isArray(data) && data.length > 0) {
        const first = data[0]
        if (first.response) return first.response
        if (first.message) return first.message
        if (first.content) return first.content
        if (first.output) return first.output
        if (first.text) return first.text
        return JSON.stringify(first)
      }
      if (data.response) {
        return data.response
      }
      if (data.message) {
        return data.message
      }
      if (data.content) {
        return data.content
      }
      if (data.output) {
        return data.output
      }
      if (data.text) {
        return data.text
      }

      // Return stringified data if no known field
      return JSON.stringify(data)
    } catch (error) {
      console.warn("Flask webhook failed, trying Symfony fallback:", error)

      // Fallback to Symfony demo endpoint
      try {
        return await this.callDemoChat(message, agentId)
      } catch (fallbackError) {
        console.error("All AI endpoints failed:", fallbackError)
        throw new Error("Service IA temporairement indisponible. Veuillez réessayer.")
      }
    }
  }

  // === STRIPE ===

  async createCheckoutSession(planSlug: string, interval: "monthly" | "yearly") {
    return this.request<{ sessionId: string; url: string }>("/api/stripe/checkout", {
      method: "POST",
      body: JSON.stringify({ plan: planSlug, interval }),
    })
  }

  async createPortalSession() {
    return this.request<{ url: string }>("/api/stripe/portal", {
      method: "POST",
    })
  }

  async getSubscription() {
    return this.request<{
      id: string
      planSlug: string
      status: "active" | "canceled" | "past_due" | "trialing"
      currentPeriodStart: string
      currentPeriodEnd: string
      cancelAtPeriodEnd: boolean
      interval: "monthly" | "yearly"
    } | null>("/api/stripe/subscription")
  }

  async cancelSubscription() {
    return this.request<{ message: string }>("/api/stripe/subscription/cancel", {
      method: "POST",
    })
  }

  async resumeSubscription() {
    return this.request<{ message: string }>("/api/stripe/subscription/resume", {
      method: "POST",
    })
  }
}

export const backendApi = new BackendApi(BACKEND_URL)
export default backendApi
