"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  className?: string
  showLabel?: boolean
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = !mounted || resolvedTheme === "dark"

  const handleToggle = () => {
    const nextTheme = isDark ? "light" : "dark"
    setTheme(nextTheme)
    toast.add({
      title: nextTheme === "light" ? "Light theme enabled" : "Dark theme enabled",
      description: "Press D anytime to switch themes.",
    })
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme (D)" : "Switch to dark theme (D)"}
      className={cn(
        "inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-[#14151b] px-2.5 text-zinc-300 transition-colors hover:border-white/20 hover:text-white",
        className
      )}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400" />
      ) : (
        <Moon className="h-4 w-4 text-[#5b4df5]" />
      )}
      {showLabel ? (
        <span className="text-[12.5px] font-medium">
          {isDark ? "Light" : "Dark"}
        </span>
      ) : null}
    </button>
  )
}

