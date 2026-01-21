import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  MessageSquare,
  Zap,
  TrendingUp,
  Clock,
  Bot,
  ArrowUpRight,
  ArrowDownRight,
  Phone,
  FileText,
  Scale,
  Users,
  Sparkles,
  Calculator,
  Briefcase,
  Download,
  RefreshCw,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/authStore"
import { backendApi } from "@/services/backend"

// Animation variants
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

interface StatCardProps {
  title: string
  value: string
  description: string
  icon: React.ElementType
  trend?: {
    value: number
    isPositive: boolean
  }
  delay?: number
}

function StatCard({ title, value, description, icon: Icon, trend, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-[var(--color-muted-foreground)]">
            {title}
          </CardTitle>
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
            <Icon className="h-4 w-4 text-[var(--color-primary)]" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[var(--color-foreground)]">{value}</div>
          <div className="flex items-center gap-2 mt-1">
            {trend && (
              <span
                className={cn(
                  "flex items-center text-xs font-medium px-1.5 py-0.5 rounded",
                  trend.isPositive
                    ? "text-green-600 bg-green-50"
                    : "text-red-600 bg-red-50"
                )}
              >
                {trend.isPositive ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {Math.abs(trend.value)}%
              </span>
            )}
            <p className="text-xs text-[var(--color-muted-foreground)]">{description}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface UsageBarProps {
  label: string
  used: number
  total: number
  color: string
  icon: React.ElementType
}

function UsageBar({ label, used, total, color, icon: Icon }: UsageBarProps) {
  const percentage = Math.min((used / total) * 100, 100)
  const isWarning = percentage > 80
  const isCritical = percentage > 95

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-[var(--color-muted-foreground)]" />
          <span className="text-[var(--color-foreground)]">{label}</span>
        </div>
        <span className={cn(
          "font-medium",
          isCritical ? "text-red-500" : isWarning ? "text-yellow-500" : "text-[var(--color-muted-foreground)]"
        )}>
          {used.toLocaleString()} / {total.toLocaleString()}
        </span>
      </div>
      <div className="h-2 rounded-full bg-[var(--color-muted)] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: isCritical ? "#ef4444" : isWarning ? "#eab308" : color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      {isWarning && (
        <p className={cn("text-xs", isCritical ? "text-red-500" : "text-yellow-500")}>
          {isCritical ? "Limite presque atteinte !" : "Attention : plus de 80% utilisé"}
        </p>
      )}
    </div>
  )
}

// Agent data with icons
const agents = [
  { id: "tom", name: "Tom", role: "Téléphonie", icon: Phone, color: "from-teal-400 to-cyan-500", usage: 23 },
  { id: "john", name: "John", role: "Marketing", icon: TrendingUp, color: "from-pink-500 to-rose-500", usage: 45 },
  { id: "lou", name: "Lou", role: "SEO", icon: FileText, color: "from-violet-500 to-purple-600", usage: 18 },
  { id: "julia", name: "Julia", role: "Juridique", icon: Scale, color: "from-amber-500 to-orange-500", usage: 31 },
  { id: "elio", name: "Elio", role: "Commercial", icon: Users, color: "from-emerald-500 to-green-600", usage: 27 },
  { id: "charly", name: "Charly+", role: "Général", icon: Sparkles, color: "from-blue-500 to-indigo-600", usage: 56 },
  { id: "manue", name: "Manue", role: "Comptabilité", icon: Calculator, color: "from-slate-500 to-gray-600", usage: 12 },
  { id: "rony", name: "Rony", role: "RH", icon: Briefcase, color: "from-red-500 to-rose-600", usage: 8 },
  { id: "chatbot", name: "Chatbot", role: "Service Client", icon: MessageSquare, color: "from-cyan-500 to-blue-500", usage: 34 },
]

interface ConversationData {
  id: number
  title: string
  totalTokens: number
  createdAt: string
  updatedAt: string
}

export function Dashboard() {
  const { user } = useAuthStore()
  const [conversations, setConversations] = useState<ConversationData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalTokens, setTotalTokens] = useState(0)

  // Load conversations
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await backendApi.getConversations()
        setConversations(data)
        setTotalTokens(data.reduce((sum, c) => sum + (c.totalTokens || 0), 0))
      } catch (error) {
        console.error("Error loading conversations:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const tokenLimit = user?.plan?.tokenLimit || 10000
  const usedTokensPercent = Math.round((totalTokens / tokenLimit) * 100)

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `Il y a ${diffMins}min`
    if (diffHours < 24) return `Il y a ${diffHours}h`
    if (diffDays === 1) return "Hier"
    return `Il y a ${diffDays}j`
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
              Tableau de bord
            </h1>
            <p className="text-[var(--color-muted-foreground)]">
              Bienvenue, {user?.firstName || "Utilisateur"}. Voici un aperçu de votre activité.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            <Button size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Nouvelle conversation
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard
            title="Conversations"
            value={conversations.length.toString()}
            description="ce mois"
            icon={MessageSquare}
            trend={{ value: 12, isPositive: true }}
            delay={0}
          />
          <StatCard
            title="Tokens utilisés"
            value={totalTokens > 1000 ? `${(totalTokens / 1000).toFixed(1)}K` : totalTokens.toString()}
            description={`sur ${tokenLimit > 1000 ? `${tokenLimit / 1000}K` : tokenLimit}`}
            icon={Zap}
            trend={{ value: usedTokensPercent > 50 ? 8 : -5, isPositive: usedTokensPercent < 80 }}
            delay={0.1}
          />
          <StatCard
            title="Temps économisé"
            value={`${Math.round(totalTokens / 500)}h`}
            description="estimé ce mois"
            icon={Clock}
            trend={{ value: 23, isPositive: true }}
            delay={0.2}
          />
          <StatCard
            title="Plan actif"
            value={user?.plan?.name || "Free"}
            description={user?.plan?.slug === "free" ? "Passez au Pro" : "Actif"}
            icon={Bot}
            delay={0.3}
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Usage Card - 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Utilisation du plan</CardTitle>
                  <CardDescription>
                    Plan {user?.plan?.name || "Free"} - Renouvellement le 1er février
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <UsageBar
                  label="Tokens"
                  used={totalTokens}
                  total={tokenLimit}
                  color="oklch(0.55 0.2 270)"
                  icon={Zap}
                />
                <UsageBar
                  label="Conversations"
                  used={conversations.length}
                  total={100}
                  color="oklch(0.65 0.15 160)"
                  icon={MessageSquare}
                />
                <UsageBar
                  label="Agents utilisés"
                  used={5}
                  total={9}
                  color="oklch(0.6 0.18 290)"
                  icon={Bot}
                />

                {user?.plan?.slug === "free" && (
                  <div className="pt-4 border-t border-[var(--color-border)]">
                    <div className="p-4 rounded-lg bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[var(--color-foreground)]">
                            Passez au Pro pour 29€/mois
                          </p>
                          <p className="text-sm text-[var(--color-muted-foreground)]">
                            5 agents, 500K tokens, support prioritaire
                          </p>
                        </div>
                        <Button
                          className="bg-gradient-to-r from-violet-500 to-purple-600"
                          onClick={() => window.location.hash = "pricing"}
                        >
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Upgrade
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Agents Usage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Agents populaires</CardTitle>
                <CardDescription>Vos agents les plus utilisés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {agents
                    .sort((a, b) => b.usage - a.usage)
                    .slice(0, 5)
                    .map((agent, index) => (
                      <motion.div
                        key={agent.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--color-muted)] transition-colors cursor-pointer"
                      >
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center`}>
                          <agent.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-[var(--color-foreground)]">
                            {agent.name}
                          </p>
                          <p className="text-xs text-[var(--color-muted-foreground)]">
                            {agent.role}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-[var(--color-primary)]">
                          {agent.usage}%
                        </span>
                      </motion.div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Conversations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Conversations récentes</CardTitle>
                <CardDescription>Vos dernières interactions avec QUERNEL IA</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                Voir tout
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-4 p-3 animate-pulse">
                      <div className="w-10 h-10 rounded-lg bg-[var(--color-muted)]" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-[var(--color-muted)] rounded w-1/3" />
                        <div className="h-3 bg-[var(--color-muted)] rounded w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 mx-auto text-[var(--color-muted-foreground)] mb-3" />
                  <p className="text-[var(--color-muted-foreground)]">
                    Aucune conversation pour le moment
                  </p>
                  <Button className="mt-4">
                    Démarrer une conversation
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {conversations.slice(0, 5).map((conv, index) => (
                    <motion.div
                      key={conv.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className={cn(
                        "flex items-start gap-4 p-3 rounded-lg",
                        "hover:bg-[var(--color-muted)] transition-colors cursor-pointer group"
                      )}
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm text-[var(--color-foreground)] truncate">
                            {conv.title || "Nouvelle conversation"}
                          </h4>
                          <span className="text-xs text-[var(--color-muted-foreground)]">
                            {formatRelativeTime(conv.updatedAt || conv.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-[var(--color-muted-foreground)] flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            {(conv.totalTokens || 0).toLocaleString()} tokens
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
              <CardDescription>Démarrez rapidement avec ces suggestions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: "📊", title: "Analyser", desc: "Documents et données", color: "hover:border-blue-500" },
                  { icon: "✍️", title: "Rédiger", desc: "Emails et rapports", color: "hover:border-green-500" },
                  { icon: "🌍", title: "Traduire", desc: "Contenus multilingues", color: "hover:border-purple-500" },
                  { icon: "⚙️", title: "Paramètres", desc: "Gérer votre compte", color: "hover:border-orange-500" },
                ].map((action, index) => (
                  <motion.button
                    key={action.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex flex-col items-center gap-3 p-6 rounded-xl",
                      "border border-[var(--color-border)] bg-[var(--color-card)]",
                      "hover:bg-[var(--color-muted)] transition-all",
                      action.color,
                      "group"
                    )}
                  >
                    <span className="text-3xl group-hover:scale-110 transition-transform">
                      {action.icon}
                    </span>
                    <div className="text-center">
                      <p className="font-medium text-sm text-[var(--color-foreground)]">
                        {action.title}
                      </p>
                      <p className="text-xs text-[var(--color-muted-foreground)]">
                        {action.desc}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
