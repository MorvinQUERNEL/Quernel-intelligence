import { useState, useRef, useEffect, useCallback } from "react"
import { Plus, History, Sparkles, AlertCircle } from "lucide-react"
import { ChatMessage, type Message } from "./ChatMessage"
import { ChatInput } from "./ChatInput"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { api, type ChatMessage as ApiChatMessage } from "@/services/api"

// Simulated conversation history
const mockConversations = [
  { id: "1", title: "Analyse de données clients", date: "Aujourd'hui" },
  { id: "2", title: "Rédaction email marketing", date: "Aujourd'hui" },
  { id: "3", title: "Traduction document technique", date: "Hier" },
  { id: "4", title: "Synthèse rapport financier", date: "Hier" },
]

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Check API connection on mount
  useEffect(() => {
    api.healthCheck().then(setIsConnected)
  }, [])

  const handleSend = useCallback(async (content: string) => {
    setError(null)

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Prepare messages for API
    const apiMessages: ApiChatMessage[] = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }))
    apiMessages.push({ role: "user", content })

    // Create assistant message placeholder
    const assistantMessageId = (Date.now() + 1).toString()
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, assistantMessage])

    try {
      // Use streaming API
      let fullContent = ""

      for await (const chunk of api.chatCompletionStream(apiMessages)) {
        fullContent += chunk
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessageId ? { ...m, content: fullContent } : m
          )
        )
      }
    } catch (err) {
      console.error("Error:", err)
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue. Vérifiez la connexion au serveur."
      )
      // Remove empty assistant message on error
      setMessages((prev) => prev.filter((m) => m.id !== assistantMessageId))
    } finally {
      setIsLoading(false)
    }
  }, [messages])

  const startNewChat = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setMessages([])
    setError(null)
  }

  return (
    <div className="flex h-full">
      {/* Conversation History Sidebar */}
      <div
        className={cn(
          "w-64 border-r border-[var(--color-border)] bg-[var(--color-card)] flex flex-col",
          "transition-all duration-300",
          showHistory ? "translate-x-0" : "-translate-x-full absolute md:relative md:translate-x-0"
        )}
      >
        <div className="p-4 border-b border-[var(--color-border)]">
          <Button onClick={startNewChat} className="w-full" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle conversation
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {mockConversations.map((conv, index) => (
            <div key={conv.id}>
              {(index === 0 || mockConversations[index - 1].date !== conv.date) && (
                <p className="text-xs text-[var(--color-muted-foreground)] px-3 py-2 font-medium">
                  {conv.date}
                </p>
              )}
              <button
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm",
                  "hover:bg-[var(--color-muted)] transition-colors",
                  "text-[var(--color-foreground)] truncate"
                )}
              >
                {conv.title}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 border-b border-[var(--color-border)] flex items-center justify-between px-4 bg-[var(--color-card)]">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setShowHistory(!showHistory)}
            >
              <History className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  isConnected === null
                    ? "bg-yellow-500"
                    : isConnected
                    ? "bg-[var(--color-secondary)] animate-pulse"
                    : "bg-[var(--color-destructive)]"
                )}
              />
              <span className="font-medium text-[var(--color-foreground)]">
                QUERNEL IA
              </span>
              <span className="text-xs text-[var(--color-muted-foreground)] px-2 py-0.5 rounded-full bg-[var(--color-muted)]">
                Qwen2.5-32B
              </span>
            </div>
          </div>
          {isConnected === false && (
            <span className="text-xs text-[var(--color-destructive)] flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              API déconnectée
            </span>
          )}
        </header>

        {/* Error Banner */}
        {error && (
          <div className="px-4 py-3 bg-[var(--color-destructive)]/10 border-b border-[var(--color-destructive)]/20">
            <p className="text-sm text-[var(--color-destructive)] flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-[var(--color-foreground)] mb-2">
                Bienvenue sur QUERNEL IA
              </h2>
              <p className="text-[var(--color-muted-foreground)] text-center max-w-md mb-8">
                Votre assistant IA souverain, hébergé en France. Posez-moi vos questions ou demandez-moi de vous aider dans vos tâches professionnelles.
              </p>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3 max-w-lg w-full">
                {[
                  { icon: "📊", text: "Aide-moi à analyser des données" },
                  { icon: "✍️", text: "Rédige un email professionnel" },
                  { icon: "🌍", text: "Traduis ce texte en anglais" },
                  { icon: "💡", text: "Propose des idées créatives" },
                ].map((action) => (
                  <button
                    key={action.text}
                    onClick={() => handleSend(action.text)}
                    disabled={isLoading}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl",
                      "border border-[var(--color-border)] bg-[var(--color-card)]",
                      "hover:bg-[var(--color-muted)] transition-colors",
                      "text-left text-sm text-[var(--color-foreground)]",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    <span className="text-xl">{action.icon}</span>
                    {action.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && messages[messages.length - 1]?.content === "" && (
                <div className="flex gap-4 px-4 py-6 bg-[var(--color-muted)]/50">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm text-[var(--color-muted-foreground)]">
                      QUERNEL IA réfléchit...
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <ChatInput onSend={handleSend} isLoading={isLoading} disabled={isConnected === false} />
      </div>
    </div>
  )
}
