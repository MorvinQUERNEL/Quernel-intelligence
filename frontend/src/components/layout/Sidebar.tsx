import { useState } from "react"
import {
  MessageSquare,
  LayoutDashboard,
  Bot,
  Settings,
  CreditCard,
  Users,
  Key,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Moon,
  Sun,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { useAuthStore } from "@/stores/authStore"

interface NavItem {
  icon: React.ElementType
  label: string
  href: string
  badge?: string
}

const mainNavItems: NavItem[] = [
  { icon: MessageSquare, label: "Chat IA", href: "/chat" },
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Bot, label: "Agents", href: "/agents", badge: "Pro" },
  { icon: Key, label: "API Keys", href: "/api-keys" },
]

const bottomNavItems: NavItem[] = [
  { icon: Users, label: "Équipe", href: "/team" },
  { icon: CreditCard, label: "Facturation", href: "/billing" },
  { icon: Settings, label: "Paramètres", href: "/settings" },
]

interface SidebarProps {
  currentPath: string
  onNavigate: (path: string) => void
}

export function Sidebar({ currentPath, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const { user, logout } = useAuthStore()

  const userInitials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
    : "??"
  const planLabel = user?.plan?.name || "Free"

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
  }

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = currentPath === item.href
    const Icon = item.icon

    return (
      <button
        onClick={() => onNavigate(item.href)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
            : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]",
          collapsed && "justify-center px-2"
        )}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--color-accent)] text-[var(--color-accent-foreground)]">
                {item.badge}
              </span>
            )}
          </>
        )}
      </button>
    )
  }

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-[var(--color-card)] border-r border-[var(--color-border)] transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--color-border)]">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
              <span className="text-white font-bold text-sm">QI</span>
            </div>
            <span className="font-semibold text-[var(--color-foreground)] text-sm">
              QUERNEL INTELLIGENCE
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {mainNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-3 space-y-1 border-t border-[var(--color-border)]">
        {bottomNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
            "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]",
            collapsed && "justify-center px-2"
          )}
        >
          {darkMode ? (
            <Sun className="h-5 w-5 flex-shrink-0" />
          ) : (
            <Moon className="h-5 w-5 flex-shrink-0" />
          )}
          {!collapsed && <span>Mode {darkMode ? "clair" : "sombre"}</span>}
        </button>

        {/* User Profile */}
        <div
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg mt-2",
            "bg-[var(--color-muted)]",
            collapsed && "justify-center px-2"
          )}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-medium">{userInitials}</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--color-foreground)] truncate">
                {user ? `${user.firstName} ${user.lastName}` : "Utilisateur"}
              </p>
              <p className="text-xs text-[var(--color-muted-foreground)] truncate">
                Plan {planLabel}
              </p>
            </div>
          )}
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0"
              onClick={logout}
              title="Se déconnecter"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </aside>
  )
}
