import { useState, useRef, useEffect, type KeyboardEvent } from "react"
import { Send, Paperclip, Mic, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
  disabled?: boolean
}

export function ChatInput({ onSend, isLoading, disabled }: ChatInputProps) {
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px"
    }
  }, [input])

  const handleSubmit = () => {
    if (input.trim() && !isLoading && !disabled) {
      onSend(input.trim())
      setInput("")
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="border-t border-[var(--color-border)] bg-[var(--color-card)] p-4">
      <div className="max-w-3xl mx-auto">
        <div
          className={cn(
            "flex items-end gap-2 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]",
            "focus-within:ring-2 focus-within:ring-[var(--color-ring)] focus-within:border-transparent",
            "transition-all duration-200"
          )}
        >
          {/* Attachment button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 flex-shrink-0 text-[var(--color-muted-foreground)]"
            disabled={disabled}
          >
            <Paperclip className="h-5 w-5" />
          </Button>

          {/* Text input */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Envoyez un message à QUERNEL IA..."
            disabled={disabled || isLoading}
            rows={1}
            className={cn(
              "flex-1 resize-none bg-transparent border-0 outline-none",
              "text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)]",
              "min-h-[24px] max-h-[200px] py-1.5"
            )}
          />

          {/* Voice input */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 flex-shrink-0 text-[var(--color-muted-foreground)]"
            disabled={disabled}
          >
            <Mic className="h-5 w-5" />
          </Button>

          {/* Send button */}
          <Button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading || disabled}
            size="icon"
            className="h-9 w-9 flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>

        <p className="text-xs text-center text-[var(--color-muted-foreground)] mt-3">
          QUERNEL IA peut faire des erreurs. Vérifiez les informations importantes.
        </p>
      </div>
    </div>
  )
}
