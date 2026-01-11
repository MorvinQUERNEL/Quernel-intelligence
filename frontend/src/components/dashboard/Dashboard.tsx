import {
  MessageSquare,
  Zap,
  TrendingUp,
  Clock,
  Bot,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string
  description: string
  icon: React.ElementType
  trend?: {
    value: number
    isPositive: boolean
  }
}

function StatCard({ title, value, description, icon: Icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-[var(--color-muted-foreground)]">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-[var(--color-muted-foreground)]" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-[var(--color-foreground)]">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          {trend && (
            <span
              className={cn(
                "flex items-center text-xs font-medium",
                trend.isPositive
                  ? "text-[var(--color-secondary)]"
                  : "text-[var(--color-destructive)]"
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
  )
}

interface UsageBarProps {
  label: string
  used: number
  total: number
  color: string
}

function UsageBar({ label, used, total, color }: UsageBarProps) {
  const percentage = Math.min((used / total) * 100, 100)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--color-foreground)]">{label}</span>
        <span className="text-[var(--color-muted-foreground)]">
          {used.toLocaleString()} / {total.toLocaleString()}
        </span>
      </div>
      <div className="h-2 rounded-full bg-[var(--color-muted)]">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

interface RecentConversation {
  id: string
  title: string
  preview: string
  time: string
  tokens: number
}

const recentConversations: RecentConversation[] = [
  {
    id: "1",
    title: "Analyse de données clients",
    preview: "Les données montrent une augmentation de 15%...",
    time: "Il y a 2h",
    tokens: 1234,
  },
  {
    id: "2",
    title: "Rédaction email marketing",
    preview: "Voici un email professionnel pour votre campagne...",
    time: "Il y a 4h",
    tokens: 856,
  },
  {
    id: "3",
    title: "Traduction document technique",
    preview: "Le document a été traduit en anglais...",
    time: "Hier",
    tokens: 2341,
  },
]

export function Dashboard() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
              Tableau de bord
            </h1>
            <p className="text-[var(--color-muted-foreground)]">
              Bienvenue, Lucienne. Voici un aperçu de votre activité.
            </p>
          </div>
          <Button>
            <MessageSquare className="w-4 h-4 mr-2" />
            Nouvelle conversation
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Conversations"
            value="47"
            description="ce mois"
            icon={MessageSquare}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Tokens utilisés"
            value="45.2K"
            description="sur 100K"
            icon={Zap}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Temps économisé"
            value="12h"
            description="estimé ce mois"
            icon={Clock}
            trend={{ value: 23, isPositive: true }}
          />
          <StatCard
            title="Agents actifs"
            value="3"
            description="sur 5 disponibles"
            icon={Bot}
          />
        </div>

        {/* Usage & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Usage */}
          <Card>
            <CardHeader>
              <CardTitle>Utilisation du plan</CardTitle>
              <CardDescription>Plan Pro - Renouvellement le 1er février</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <UsageBar
                label="Tokens"
                used={45234}
                total={100000}
                color="oklch(0.55 0.2 270)"
              />
              <UsageBar
                label="Agents"
                used={3}
                total={5}
                color="oklch(0.65 0.15 160)"
              />
              <UsageBar
                label="Documents RAG"
                used={12}
                total={50}
                color="oklch(0.6 0.18 290)"
              />
              <div className="pt-4 border-t border-[var(--color-border)]">
                <Button variant="outline" className="w-full">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Passer au plan Business
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Conversations */}
          <Card>
            <CardHeader>
              <CardTitle>Conversations récentes</CardTitle>
              <CardDescription>Vos dernières interactions avec QUERNEL IA</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={cn(
                      "flex items-start gap-4 p-3 rounded-lg",
                      "hover:bg-[var(--color-muted)] transition-colors cursor-pointer"
                    )}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm text-[var(--color-foreground)] truncate">
                          {conv.title}
                        </h4>
                        <span className="text-xs text-[var(--color-muted-foreground)]">
                          {conv.time}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--color-muted-foreground)] truncate mt-0.5">
                        {conv.preview}
                      </p>
                      <span className="text-xs text-[var(--color-muted-foreground)]">
                        {conv.tokens.toLocaleString()} tokens
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>Démarrez rapidement avec ces suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: "📊", title: "Analyser", desc: "Documents et données" },
                { icon: "✍️", title: "Rédiger", desc: "Emails et rapports" },
                { icon: "🌍", title: "Traduire", desc: "Contenus multilingues" },
                { icon: "🤖", title: "Automatiser", desc: "Workflows avec n8n" },
              ].map((action) => (
                <button
                  key={action.title}
                  className={cn(
                    "flex flex-col items-center gap-3 p-6 rounded-xl",
                    "border border-[var(--color-border)] bg-[var(--color-card)]",
                    "hover:bg-[var(--color-muted)] hover:border-[var(--color-primary)] transition-all",
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
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
