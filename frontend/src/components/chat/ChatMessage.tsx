import { Bot, User, Copy, Check } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const isAssistant = message.role === "assistant"

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        "group flex gap-4 px-4 py-6 animate-fade-in",
        isAssistant ? "bg-[var(--color-muted)]/50" : "bg-transparent"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
          isAssistant
            ? "bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)]"
            : "bg-[var(--color-secondary)]"
        )}
      >
        {isAssistant ? (
          <Bot className="w-5 h-5 text-white" />
        ) : (
          <User className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-[var(--color-foreground)]">
            {isAssistant ? "QUERNEL IA" : "Vous"}
          </span>
          <span className="text-xs text-[var(--color-muted-foreground)]">
            {message.timestamp.toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div className="prose prose-sm max-w-none text-[var(--color-foreground)]">
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        </div>

        {/* Actions */}
        {isAssistant && (
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 px-2 text-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 mr-1" />
                  Copié
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" />
                  Copier
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
