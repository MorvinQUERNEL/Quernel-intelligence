import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Check } from "lucide-react"
import * as Icons from "lucide-react"
import { useAgentStore, type Agent } from "@/stores/agentStore"
import { cn } from "@/lib/utils"

interface AgentSelectorProps {
  isDark?: boolean
  compact?: boolean
  onChange?: (agent: Agent) => void
}

export function AgentSelector({ isDark = true, compact = false, onChange }: AgentSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { agents, selectedAgent, setSelectedAgent } = useAgentStore()

  const handleSelect = (agent: Agent) => {
    setSelectedAgent(agent)
    setIsOpen(false)
    onChange?.(agent)
  }

  // Get dynamic icon component
  const getIcon = (iconName: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconComponent = (Icons as any)[iconName]
    return IconComponent || Icons.Bot
  }

  const SelectedIcon = selectedAgent ? getIcon(selectedAgent.icon) : Icons.Bot

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-xl transition-all",
          "border",
          isDark
            ? "bg-white/5 border-white/10 hover:bg-white/10"
            : "bg-gray-50 border-gray-200 hover:bg-gray-100",
          compact ? "text-sm" : "text-base"
        )}
      >
        {selectedAgent && (
          <>
            <div
              className={cn(
                "rounded-lg flex items-center justify-center text-white",
                compact ? "w-6 h-6" : "w-8 h-8"
              )}
              style={{ backgroundColor: selectedAgent.color }}
            >
              <SelectedIcon className={compact ? "w-3 h-3" : "w-4 h-4"} />
            </div>
            <div className="text-left">
              <p className={cn(
                "font-medium",
                isDark ? "text-white" : "text-gray-900",
                compact ? "text-sm" : "text-base"
              )}>
                {selectedAgent.name}
              </p>
              {!compact && (
                <p className={cn(
                  "text-xs",
                  isDark ? "text-gray-400" : "text-gray-500"
                )}>
                  {selectedAgent.role}
                </p>
              )}
            </div>
          </>
        )}
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform ml-auto",
            isDark ? "text-gray-400" : "text-gray-500",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={cn(
                "absolute top-full left-0 mt-2 z-50",
                "w-72 max-h-96 overflow-y-auto",
                "rounded-xl border shadow-xl",
                isDark
                  ? "bg-[#1a1a24] border-white/10"
                  : "bg-white border-gray-200"
              )}
            >
              <div className="p-2">
                <p className={cn(
                  "text-xs font-medium px-3 py-2",
                  isDark ? "text-gray-500" : "text-gray-400"
                )}>
                  Sélectionner un agent
                </p>

                {agents.map((agent) => {
                  const AgentIcon = getIcon(agent.icon)
                  const isSelected = selectedAgent?.id === agent.id

                  return (
                    <button
                      key={agent.id}
                      onClick={() => handleSelect(agent)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                        "text-left",
                        isSelected
                          ? isDark
                            ? "bg-white/10"
                            : "bg-gray-100"
                          : isDark
                          ? "hover:bg-white/5"
                          : "hover:bg-gray-50"
                      )}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                        style={{ backgroundColor: agent.color }}
                      >
                        <AgentIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "font-medium truncate",
                          isDark ? "text-white" : "text-gray-900"
                        )}>
                          {agent.name}
                        </p>
                        <p className={cn(
                          "text-xs truncate",
                          isDark ? "text-gray-400" : "text-gray-500"
                        )}>
                          {agent.role}
                        </p>
                      </div>
                      {isSelected && (
                        <Check
                          className="w-4 h-4 flex-shrink-0"
                          style={{ color: agent.color }}
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
