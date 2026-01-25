import { useState, useEffect } from "react"
import {
  History,
  Trash2,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { backendApi, type AIHistoryByAgent, type AIUserStats, type AIConversationMessage } from "@/services/backend"
import { useAgentStore } from "@/stores/agentStore"

interface AIHistoryPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function AIHistoryPanel({ isOpen, onClose }: AIHistoryPanelProps) {
  const [history, setHistory] = useState<AIHistoryByAgent>({})
  const [stats, setStats] = useState<AIUserStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedAgents, setExpandedAgents] = useState<Set<string>>(new Set())
  const [deletingAgent, setDeletingAgent] = useState<string | null>(null)
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false)

  const { agents } = useAgentStore()

  const loadHistory = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await backendApi.getAIHistory()
      if (data) {
        setHistory(data.conversations || {})
        setStats(data.stats || null)
      } else {
        setError("Impossible de charger l'historique")
      }
    } catch {
      setError("Erreur de connexion au serveur")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadHistory()
    }
  }, [isOpen])

  const toggleAgent = (agentId: string) => {
    const newExpanded = new Set(expandedAgents)
    if (newExpanded.has(agentId)) {
      newExpanded.delete(agentId)
    } else {
      newExpanded.add(agentId)
    }
    setExpandedAgents(newExpanded)
  }

  const handleDeleteAgentHistory = async (agentId: string) => {
    setDeletingAgent(agentId)
    try {
      const result = await backendApi.deleteAgentAIHistory(agentId)
      if (result?.success) {
        // Mettre a jour l'historique local
        const newHistory = { ...history }
        delete newHistory[agentId]
        setHistory(newHistory)
      }
    } catch {
      setError("Erreur lors de la suppression")
    } finally {
      setDeletingAgent(null)
    }
  }

  const handleDeleteAllHistory = async () => {
    setLoading(true)
    try {
      const result = await backendApi.deleteAllAIHistory()
      if (result?.success) {
        setHistory({})
        setStats(null)
        setConfirmDeleteAll(false)
      }
    } catch {
      setError("Erreur lors de la suppression")
    } finally {
      setLoading(false)
    }
  }

  const getAgentInfo = (agentId: string) => {
    return agents.find((a) => a.id === agentId) || { name: agentId, color: "#6b7280" }
  }

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--color-card)] rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
              <History className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
                Historique des conversations
              </h2>
              {stats && (
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  {stats.total_conversations || 0} messages au total
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={loadHistory} disabled={loading}>
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-[var(--color-destructive)]/10 text-[var(--color-destructive)]">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {loading && Object.keys(history).length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin text-[var(--color-muted-foreground)]" />
            </div>
          ) : Object.keys(history).length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-[var(--color-muted-foreground)] opacity-50" />
              <p className="text-[var(--color-muted-foreground)]">
                Aucun historique de conversation
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(history).map(([agentId, messages]) => {
                const agent = getAgentInfo(agentId)
                const isExpanded = expandedAgents.has(agentId)

                return (
                  <div
                    key={agentId}
                    className="rounded-lg border border-[var(--color-border)] overflow-hidden"
                  >
                    {/* Agent Header */}
                    <button
                      onClick={() => toggleAgent(agentId)}
                      className="w-full flex items-center justify-between p-3 hover:bg-[var(--color-muted)] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-sm"
                          style={{ backgroundColor: agent.color }}
                        >
                          {agent.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-[var(--color-foreground)]">
                            {agent.name}
                          </p>
                          <p className="text-xs text-[var(--color-muted-foreground)]">
                            {messages.length} message{messages.length > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[var(--color-destructive)] hover:text-[var(--color-destructive)]"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteAgentHistory(agentId)
                          }}
                          disabled={deletingAgent === agentId}
                        >
                          {deletingAgent === agentId ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-[var(--color-muted-foreground)]" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-[var(--color-muted-foreground)]" />
                        )}
                      </div>
                    </button>

                    {/* Messages */}
                    {isExpanded && (
                      <div className="border-t border-[var(--color-border)] divide-y divide-[var(--color-border)]">
                        {messages.slice(-10).reverse().map((msg: AIConversationMessage, idx: number) => (
                          <div key={idx} className="p-3 text-sm">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-[var(--color-foreground)]">
                                Vous
                              </span>
                              <span className="text-xs text-[var(--color-muted-foreground)]">
                                {formatDate(msg.timestamp)}
                              </span>
                            </div>
                            <p className="text-[var(--color-muted-foreground)] mb-2 line-clamp-2">
                              {msg.message}
                            </p>
                            <div className="pl-3 border-l-2 border-[var(--color-primary)]">
                              <span className="font-medium text-[var(--color-foreground)]">
                                {agent.name}
                              </span>
                              <p className="text-[var(--color-muted-foreground)] line-clamp-3">
                                {msg.response}
                              </p>
                            </div>
                          </div>
                        ))}
                        {messages.length > 10 && (
                          <div className="p-2 text-center text-xs text-[var(--color-muted-foreground)]">
                            + {messages.length - 10} messages plus anciens
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {Object.keys(history).length > 0 && (
          <div className="p-4 border-t border-[var(--color-border)]">
            {confirmDeleteAll ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-destructive)]">
                  Supprimer tout l'historique ?
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirmDeleteAll(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteAllHistory}
                    disabled={loading}
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-2" />
                    )}
                    Confirmer
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full text-[var(--color-destructive)] border-[var(--color-destructive)]/30 hover:bg-[var(--color-destructive)]/10"
                onClick={() => setConfirmDeleteAll(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer tout l'historique
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
