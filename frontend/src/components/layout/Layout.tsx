import type { ReactNode } from "react"
import { Sidebar } from "./Sidebar"

interface LayoutProps {
  children: ReactNode
  currentPath: string
  onNavigate: (path: string) => void
}

export function Layout({ children, currentPath, onNavigate }: LayoutProps) {
  return (
    <div className="flex h-screen bg-[var(--color-background)]">
      <Sidebar currentPath={currentPath} onNavigate={onNavigate} />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  )
}
