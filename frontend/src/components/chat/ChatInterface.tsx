import { useState, useRef, useEffect, useCallback } from "react"
import { Plus, History, Sparkles, AlertCircle, Trash2 } from "lucide-react"
import { ChatMessage, type Message } from "./ChatMessage"
import { ChatInput } from "./ChatInput"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { backendApi } from "@/services/backend"
import { useAuthStore } from "@/stores/authStore"

interface Conversation {
  id: number
  title: string
  totalTokens: number
  messageCount?: number
  createdAt: string
  updatedAt: string
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { isAuthenticated, user } = useAuthStore()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load conversations on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadConversations()
      setIsConnected(true)
    } else {
      setIsConnected(false)
    }
  }, [isAuthenticated])

  const loadConversations = async () => {
    try {
      const data = await backendApi.getConversations()
      setConversations(data)
    } catch (err) {
      console.error("Error loading conversations:", err)
    }
  }

  const loadConversation = async (id: number) => {
    try {
      const data = await backendApi.getConversation(id)
      setCurrentConversationId(id)
      setMessages(
        data.messages.map((m) => ({
          id: m.id.toString(),
          role: m.role as "user" | "assistant",
          content: m.content,
          timestamp: new Date(m.createdAt),
        }))
      )
      setError(null)
    } catch (err) {
      console.error("Error loading conversation:", err)
      setError("Erreur lors du chargement de la conversation")
    }
  }

  const createNewConversation = async (firstMessage?: string): Promise<number | null> => {
    try {
      const data = await backendApi.createConversation({
        title: firstMessage ? firstMessage.substring(0, 50) : "Nouvelle conversation",
      })
      setCurrentConversationId(data.id)
      await loadConversations()
      return data.id
    } catch (err) {
      console.error("Error creating conversation:", err)
      setError("Erreur lors de la creation de la conversation")
      return null
    }
  }

  const handleSend = useCallback(
    async (content: string) => {
      if (!isAuthenticated) {
        setError("Vous devez etre connecte pour envoyer des messages")
        return
      }

      setError(null)

      // Create conversation if needed
      let convId = currentConversationId
      if (!convId) {
        convId = await createNewConversation(content)
        if (!convId) return
      }

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

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
        let fullContent = ""

        for await (const chunk of backendApi.streamMessage(convId, content)) {
          if (chunk.type === "content") {
            fullContent += chunk.content
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMessageId ? { ...m, content: fullContent } : m
              )
            )
          } else if (chunk.type === "done") {
            // Update conversation list
            await loadConversations()
          } else if (chunk.type === "error") {
            throw new Error(chunk.error)
          }
        }
      } catch (err) {
        console.error("Error:", err)
        setError(
          err instanceof Error
            ? err.message
            : "Une erreur est survenue. Verifiez la connexion au serveur."
        )
        // Remove empty assistant message on error
        setMessages((prev) => prev.filter((m) => m.id !== assistantMessageId))
      } finally {
        setIsLoading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentConversationId, isAuthenticated]
  )

  const startNewChat = () => {
    setCurrentConversationId(null)
    setMessages([])
    setError(null)
  }

  const deleteConversation = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await backendApi.deleteConversation(id)
      if (currentConversationId === id) {
        startNewChat()
      }
      await loadConversations()
    } catch (err) {
      console.error("Error deleting conversation:", err)
    }
  }

  // Group conversations by date
  const groupedConversations = conversations.reduce(
    (acc, conv) => {
      const date = new Date(conv.updatedAt)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      let group: string
      if (date.toDateString() === today.toDateString()) {
        group = "Aujourd'hui"
      } else if (date.toDateString() === yesterday.toDateString()) {
        group = "Hier"
      } else {
        group = date.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })
      }

      if (!acc[group]) {
        acc[group] = []
      }
      acc[group].push(conv)
      return acc
    },
    {} as Record<string, Conversation[]>
  )

  return (
    <div className="flex h-full">
      {/* Conversation History Sidebar */}
      <div
        className={cn(
          "w-64 border-r border-[var(--color-border)] bg-[var(--color-card)] flex flex-col",
          "transition-all duration-300",
          showHistory
            ? "translate-x-0"
            : "-translate-x-full absolute md:relative md:translate-x-0"
        )}
      >
        <div className="p-4 border-b border-[var(--color-border)]">
          <Button onClick={startNewChat} className="w-full" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle conversation
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {Object.entries(groupedConversations).map(([date, convs]) => (
            <div key={date}>
              <p className="text-xs text-[var(--color-muted-foreground)] px-3 py-2 font-medium">
                {date}
              </p>
              {convs.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => loadConversation(conv.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm group flex items-center justify-between",
                    "hover:bg-[var(--color-muted)] transition-colors",
                    "text-[var(--color-foreground)]",
                    currentConversationId === conv.id && "bg-[var(--color-muted)]"
                  )}
                >
                  <span className="truncate flex-1">{conv.title}</span>
                  <button
                    onClick={(e) => deleteConversation(conv.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-[var(--color-destructive)] transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </button>
              ))}
            </div>
          ))}
          {conversations.length === 0 && (
            <p className="text-sm text-[var(--color-muted-foreground)] text-center py-4">
              Aucune conversation
            </p>
          )}
        </div>

        {/* User info */}
        {user && (
          <div className="p-3 border-t border-[var(--color-border)] text-xs text-[var(--color-muted-foreground)]">
            <p className="truncate">{user.email}</p>
            <p className="text-[var(--color-primary)]">{user.plan?.name || "Free"}</p>
          </div>
        )}
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
          {!isAuthenticated && (
            <span className="text-xs text-[var(--color-destructive)] flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Non connecte
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
                Votre assistant IA souverain, heberge en France. Posez-moi vos
                questions ou demandez-moi de vous aider dans vos taches
                professionnelles.
              </p>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3 max-w-lg w-full">
                {[
                  { icon: "📊", text: "Aide-moi a analyser des donnees" },
                  { icon: "✍️", text: "Redige un email professionnel" },
                  { icon: "🌍", text: "Traduis ce texte en anglais" },
                  { icon: "💡", text: "Propose des idees creatives" },
                ].map((action) => (
                  <button
                    key={action.text}
                    onClick={() => handleSend(action.text)}
                    disabled={isLoading || !isAuthenticated}
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
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-white animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-white animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-white animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm text-[var(--color-muted-foreground)]">
                      QUERNEL IA reflechit...
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <ChatInput
          onSend={handleSend}
          isLoading={isLoading}
          disabled={!isAuthenticated}
        />
      </div>
    </div>
  )
}
