"use client"

import * as React from "react"
import { Eye, EyeOff, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface AuthInputProps extends React.ComponentProps<"input"> {
  label: string
  icon: LucideIcon
  action?: React.ReactNode
  revealable?: boolean
}

export function AuthInput({
  label,
  icon: Icon,
  action,
  revealable = false,
  id,
  type,
  className,
  ...props
}: AuthInputProps) {
  const [revealed, setRevealed] = React.useState(false)
  const inputType = revealable ? (revealed ? "text" : "password") : type

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-medium text-neutral-300">
          {label}
        </label>
        {action}
      </div>
      <div className="relative flex items-center">
        <Icon className="absolute left-3.5 size-4 text-neutral-500" />
        <input
          id={id}
          type={inputType}
          className={cn(
            "h-11 w-full rounded-xl border border-white/10 bg-[#16161a] text-sm text-white placeholder-neutral-500 transition-colors outline-none focus:border-[#5b4df5] focus:ring-1 focus:ring-[#5b4df5] disabled:opacity-50",
            revealable ? "pr-10 pl-10" : "pr-4 pl-10",
            className
          )}
          {...props}
        />
        {revealable && (
          <button
            type="button"
            onClick={() => setRevealed((value) => !value)}
            className="absolute right-3.5 text-neutral-500 transition-colors hover:text-neutral-300"
            aria-label={revealed ? "Hide password" : "Show password"}
          >
            {revealed ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        )}
      </div>
    </div>
  )
}
