import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Users,
  CreditCard,
  TrendingUp,
  UserCheck,
  Search,
  ChevronLeft,
  ChevronRight,
  Shield,
  Crown,
  User,
  MoreVertical,
  Ban,
  CheckCircle,
  Eye,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { backendApi } from "@/services/backend"
import { useAuthStore } from "@/stores/authStore"
import { cn } from "@/lib/utils"

interface AdminStats {
  totalUsers: number
  activeUsers: number
  proUsers: number
  newUsersThisMonth: number
  usersByPlan: Array<{ plan: string; planName: string; count: number }>
  recentSignups: Array<{
    id: string
    email: string
    fullName: string
    plan: string
    createdAt: string
  }>
  revenue: { mrr: number; currency: string }
}

interface AdminUser {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  avatarUrl: string | null
  roles: string[]
  isActive: boolean
  plan: { slug: string; name: string } | null
  emailVerified: boolean
  authProvider: string | null
  createdAt: string
  lastLoginAt: string | null
}

interface AdminDashboardProps {
  onNavigateToChat: () => void
}

export function AdminDashboard({ onNavigateToChat }: AdminDashboardProps) {
  const [isDark] = useState(true)
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [planFilter, setPlanFilter] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [showUserMenu, setShowUserMenu] = useState<string | null>(null)

  const { user } = useAuthStore()

  useEffect(() => {
    loadStats()
    loadUsers()
  }, [])

  useEffect(() => {
    loadUsers()
  }, [pagination.page, searchQuery, planFilter])

  const loadStats = async () => {
    try {
      const data = await backendApi.getAdminStats()
      setStats(data)
    } catch (error) {
      console.error("Error loading admin stats:", error)
    }
  }

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const data = await backendApi.getAdminUsers({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        plan: planFilter || undefined,
      })
      setUsers(data.users)
      setPagination(data.pagination)
    } catch (error) {
      console.error("Error loading users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await backendApi.updateAdminUser(userId, { isActive: !currentStatus })
      loadUsers()
      loadStats()
    } catch (error) {
      console.error("Error updating user:", error)
    }
    setShowUserMenu(null)
  }

  const handleChangePlan = async (userId: string, newPlan: string) => {
    try {
      await backendApi.updateAdminUser(userId, { plan: newPlan })
      loadUsers()
      loadStats()
    } catch (error) {
      console.error("Error updating user plan:", error)
    }
    setShowUserMenu(null)
  }

  const getRoleBadge = (roles: string[], plan: string | undefined) => {
    if (roles.includes("ROLE_ADMIN")) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-red-500/20 text-red-400">
          <Shield className="w-3 h-3" />
          Admin
        </span>
      )
    }
    if (plan === "pro") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-violet-500/20 text-violet-400">
          <Crown className="w-3 h-3" />
          Pro
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-500/20 text-gray-400">
        <User className="w-3 h-3" />
        Gratuit
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className={cn("min-h-screen", isDark ? "dark bg-[#0a0a0f]" : "bg-gray-50")}>
      {/* Header */}
      <header
        className={cn(
          "sticky top-0 z-50 border-b backdrop-blur-lg",
          isDark ? "bg-[#0a0a0f]/90 border-white/10" : "bg-white/90 border-gray-200"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className={cn("font-bold", isDark ? "text-white" : "text-gray-900")}>
                  Administration
                </h1>
                <p className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>
                  QUERNEL INTELLIGENCE
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={onNavigateToChat}
                variant="outline"
                className={cn(
                  "flex items-center gap-2",
                  isDark ? "border-white/20 text-white hover:bg-white/10" : ""
                )}
              >
                <Sparkles className="w-4 h-4" />
                Chat IA
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user?.firstName?.[0] || "A"}
                  </span>
                </div>
                <span className={cn("text-sm", isDark ? "text-white" : "text-gray-900")}>
                  {user?.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-6 rounded-2xl border",
                isDark ? "bg-[#12121a] border-white/10" : "bg-white border-gray-200"
              )}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                    Total Utilisateurs
                  </p>
                  <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                    {stats.totalUsers}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={cn(
                "p-6 rounded-2xl border",
                isDark ? "bg-[#12121a] border-white/10" : "bg-white border-gray-200"
              )}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                    Utilisateurs Actifs
                  </p>
                  <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                    {stats.activeUsers}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={cn(
                "p-6 rounded-2xl border",
                isDark ? "bg-[#12121a] border-white/10" : "bg-white border-gray-200"
              )}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                    Utilisateurs Pro
                  </p>
                  <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                    {stats.proUsers}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={cn(
                "p-6 rounded-2xl border",
                isDark ? "bg-[#12121a] border-white/10" : "bg-white border-gray-200"
              )}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                    MRR Estime
                  </p>
                  <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                    {stats.revenue.mrr}EUR
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* New Users This Month */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={cn(
              "p-6 rounded-2xl border mb-8",
              isDark ? "bg-[#12121a] border-white/10" : "bg-white border-gray-200"
            )}
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className={cn("w-5 h-5", isDark ? "text-green-400" : "text-green-600")} />
              <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-gray-900")}>
                Nouveaux ce mois : {stats.newUsersThisMonth}
              </h2>
            </div>
            {stats.recentSignups.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {stats.recentSignups.slice(0, 5).map((signup) => (
                  <span
                    key={signup.id}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs",
                      isDark ? "bg-white/10 text-white" : "bg-gray-100 text-gray-700"
                    )}
                  >
                    {signup.fullName || signup.email}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={cn(
            "rounded-2xl border overflow-hidden",
            isDark ? "bg-[#12121a] border-white/10" : "bg-white border-gray-200"
          )}
        >
          {/* Table Header */}
          <div className={cn("p-4 border-b", isDark ? "border-white/10" : "border-gray-200")}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-gray-900")}>
                Tous les utilisateurs
              </h2>
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search
                    className={cn(
                      "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",
                      isDark ? "text-gray-400" : "text-gray-500"
                    )}
                  />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setPagination((p) => ({ ...p, page: 1 }))
                    }}
                    className={cn(
                      "pl-10 pr-4 py-2 rounded-lg text-sm w-64",
                      isDark
                        ? "bg-white/10 border-white/20 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-200 text-gray-900"
                    )}
                  />
                </div>
                {/* Plan Filter */}
                <select
                  value={planFilter}
                  onChange={(e) => {
                    setPlanFilter(e.target.value)
                    setPagination((p) => ({ ...p, page: 1 }))
                  }}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm",
                    isDark
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                  )}
                >
                  <option value="">Tous les plans</option>
                  <option value="free">Gratuit</option>
                  <option value="pro">Pro</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn("border-b", isDark ? "border-white/10" : "border-gray-200")}>
                  <th
                    className={cn(
                      "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider",
                      isDark ? "text-gray-400" : "text-gray-500"
                    )}
                  >
                    Utilisateur
                  </th>
                  <th
                    className={cn(
                      "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider",
                      isDark ? "text-gray-400" : "text-gray-500"
                    )}
                  >
                    Role
                  </th>
                  <th
                    className={cn(
                      "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider",
                      isDark ? "text-gray-400" : "text-gray-500"
                    )}
                  >
                    Statut
                  </th>
                  <th
                    className={cn(
                      "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider",
                      isDark ? "text-gray-400" : "text-gray-500"
                    )}
                  >
                    Inscription
                  </th>
                  <th
                    className={cn(
                      "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider",
                      isDark ? "text-gray-400" : "text-gray-500"
                    )}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                        <span className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                          Chargement...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className={cn("px-4 py-8 text-center", isDark ? "text-gray-400" : "text-gray-500")}
                    >
                      Aucun utilisateur trouve
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr
                      key={u.id}
                      className={cn("transition-colors", isDark ? "hover:bg-white/5" : "hover:bg-gray-50")}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center",
                              u.roles.includes("ROLE_ADMIN")
                                ? "bg-gradient-to-br from-red-500 to-orange-600"
                                : u.plan?.slug === "pro"
                                ? "bg-gradient-to-br from-violet-500 to-purple-600"
                                : "bg-gradient-to-br from-gray-500 to-gray-600"
                            )}
                          >
                            <span className="text-white font-bold text-sm">
                              {u.firstName?.[0] || u.email[0].toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>
                              {u.fullName || "Sans nom"}
                            </p>
                            <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{getRoleBadge(u.roles, u.plan?.slug)}</td>
                      <td className="px-4 py-3">
                        {u.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400">
                            <CheckCircle className="w-3 h-3" />
                            Actif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-red-500/20 text-red-400">
                            <Ban className="w-3 h-3" />
                            Inactif
                          </span>
                        )}
                      </td>
                      <td className={cn("px-4 py-3 text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative">
                          <button
                            onClick={() => setShowUserMenu(showUserMenu === u.id ? null : u.id)}
                            className={cn(
                              "p-2 rounded-lg transition-colors",
                              isDark ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                            )}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {showUserMenu === u.id && (
                            <div
                              className={cn(
                                "absolute right-0 mt-1 w-48 rounded-lg shadow-lg border z-10",
                                isDark ? "bg-[#1a1a24] border-white/10" : "bg-white border-gray-200"
                              )}
                            >
                              <button
                                onClick={() => setSelectedUser(u)}
                                className={cn(
                                  "w-full px-4 py-2 text-left text-sm flex items-center gap-2",
                                  isDark ? "text-white hover:bg-white/10" : "text-gray-700 hover:bg-gray-50"
                                )}
                              >
                                <Eye className="w-4 h-4" />
                                Voir details
                              </button>
                              <button
                                onClick={() => handleToggleUserStatus(u.id, u.isActive)}
                                className={cn(
                                  "w-full px-4 py-2 text-left text-sm flex items-center gap-2",
                                  isDark ? "text-white hover:bg-white/10" : "text-gray-700 hover:bg-gray-50"
                                )}
                              >
                                {u.isActive ? (
                                  <>
                                    <Ban className="w-4 h-4" />
                                    Desactiver
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4" />
                                    Activer
                                  </>
                                )}
                              </button>
                              {u.plan?.slug === "free" && (
                                <button
                                  onClick={() => handleChangePlan(u.id, "pro")}
                                  className={cn(
                                    "w-full px-4 py-2 text-left text-sm flex items-center gap-2",
                                    isDark
                                      ? "text-violet-400 hover:bg-white/10"
                                      : "text-violet-600 hover:bg-gray-50"
                                  )}
                                >
                                  <Crown className="w-4 h-4" />
                                  Passer en Pro
                                </button>
                              )}
                              {u.plan?.slug === "pro" && (
                                <button
                                  onClick={() => handleChangePlan(u.id, "free")}
                                  className={cn(
                                    "w-full px-4 py-2 text-left text-sm flex items-center gap-2",
                                    isDark
                                      ? "text-gray-400 hover:bg-white/10"
                                      : "text-gray-600 hover:bg-gray-50"
                                  )}
                                >
                                  <User className="w-4 h-4" />
                                  Passer en Gratuit
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div
              className={cn(
                "px-4 py-3 border-t flex items-center justify-between",
                isDark ? "border-white/10" : "border-gray-200"
              )}
            >
              <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                Page {pagination.page} sur {pagination.totalPages} ({pagination.total} utilisateurs)
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                  disabled={pagination.page === 1}
                  className={cn(isDark ? "border-white/20" : "")}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                  className={cn(isDark ? "border-white/20" : "")}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </motion.div>

        {/* User Detail Modal */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "w-full max-w-lg rounded-2xl border p-6",
                isDark ? "bg-[#12121a] border-white/10" : "bg-white border-gray-200"
              )}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center",
                      selectedUser.roles.includes("ROLE_ADMIN")
                        ? "bg-gradient-to-br from-red-500 to-orange-600"
                        : selectedUser.plan?.slug === "pro"
                        ? "bg-gradient-to-br from-violet-500 to-purple-600"
                        : "bg-gradient-to-br from-gray-500 to-gray-600"
                    )}
                  >
                    <span className="text-white font-bold text-xl">
                      {selectedUser.firstName?.[0] || selectedUser.email[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                      {selectedUser.fullName || "Sans nom"}
                    </h3>
                    <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                      {selectedUser.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className={cn(
                    "p-2 rounded-lg",
                    isDark ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                  )}
                >
                  X
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={cn("text-xs mb-1", isDark ? "text-gray-500" : "text-gray-400")}>
                      Role
                    </p>
                    {getRoleBadge(selectedUser.roles, selectedUser.plan?.slug)}
                  </div>
                  <div>
                    <p className={cn("text-xs mb-1", isDark ? "text-gray-500" : "text-gray-400")}>
                      Statut
                    </p>
                    {selectedUser.isActive ? (
                      <span className="text-green-400">Actif</span>
                    ) : (
                      <span className="text-red-400">Inactif</span>
                    )}
                  </div>
                  <div>
                    <p className={cn("text-xs mb-1", isDark ? "text-gray-500" : "text-gray-400")}>
                      Inscription
                    </p>
                    <p className={cn("text-sm", isDark ? "text-white" : "text-gray-900")}>
                      {formatDate(selectedUser.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className={cn("text-xs mb-1", isDark ? "text-gray-500" : "text-gray-400")}>
                      Derniere connexion
                    </p>
                    <p className={cn("text-sm", isDark ? "text-white" : "text-gray-900")}>
                      {selectedUser.lastLoginAt ? formatDate(selectedUser.lastLoginAt) : "Jamais"}
                    </p>
                  </div>
                  <div>
                    <p className={cn("text-xs mb-1", isDark ? "text-gray-500" : "text-gray-400")}>
                      Email verifie
                    </p>
                    <p className={cn("text-sm", isDark ? "text-white" : "text-gray-900")}>
                      {selectedUser.emailVerified ? "Oui" : "Non"}
                    </p>
                  </div>
                  <div>
                    <p className={cn("text-xs mb-1", isDark ? "text-gray-500" : "text-gray-400")}>
                      Authentification
                    </p>
                    <p className={cn("text-sm", isDark ? "text-white" : "text-gray-900")}>
                      {selectedUser.authProvider || "Email/Mot de passe"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedUser(null)}
                  className={cn(isDark ? "border-white/20" : "")}
                >
                  Fermer
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  )
}
