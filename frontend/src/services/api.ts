// Configuration API
const API_BASE_URL = "/api/v1"

export interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface ChatCompletionRequest {
  messages: ChatMessage[]
  model?: string
  temperature?: number
  max_tokens?: number
  stream?: boolean
}

export interface ChatCompletionResponse {
  id: string
  object: string
  created: number
  model: string
  choices: {
    index: number
    message: ChatMessage
    finish_reason: string
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// System prompt for QUERNEL IA
const SYSTEM_PROMPT = `Tu es QUERNEL IA, un assistant intelligent développé par QUERNEL INTELLIGENCE, une entreprise française.

Caractéristiques:
- Tu es professionnel, précis et utile
- Tu réponds en français par défaut, sauf si l'utilisateur écrit dans une autre langue
- Tu es hébergé en France, garantissant la souveraineté des données
- Tu peux aider avec l'analyse de données, la rédaction, la traduction, et bien plus

Instructions:
- Sois concis mais complet dans tes réponses
- Utilise le formatage markdown quand c'est approprié
- Si tu ne sais pas quelque chose, dis-le honnêtement`

class ApiService {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  // Chat completion sans streaming
  async chatCompletion(
    messages: ChatMessage[],
    options: Partial<ChatCompletionRequest> = {}
  ): Promise<ChatCompletionResponse> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "/workspace/models/Qwen2.5-32B-Instruct-AWQ",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        temperature: 0.7,
        max_tokens: 2048,
        stream: false,
        ...options,
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return response.json()
  }

  // Chat completion avec streaming
  async *chatCompletionStream(
    messages: ChatMessage[],
    options: Partial<ChatCompletionRequest> = {}
  ): AsyncGenerator<string, void, unknown> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "/workspace/models/Qwen2.5-32B-Instruct-AWQ",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        temperature: 0.7,
        max_tokens: 2048,
        stream: true,
        ...options,
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
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
          const data = line.slice(6)
          if (data === "[DONE]") {
            return
          }
          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content
            if (content) {
              yield content
            }
          } catch {
            // Ignore parsing errors
          }
        }
      }
    }
  }

  // Récupérer les modèles disponibles
  async getModels(): Promise<{ id: string; object: string }[]> {
    const response = await fetch(`${this.baseUrl}/models`)
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    const data = await response.json()
    return data.data
  }

  // Vérifier l'état de l'API
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/models`)
      return response.ok
    } catch {
      return false
    }
  }
}

export const api = new ApiService()
export default api
