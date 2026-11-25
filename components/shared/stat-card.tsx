import type { LucideIcon } from "lucide-react"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"

const ACCENTS = {
  indigo: "border-[#5b4df5]/25 bg-[#5b4df5]/10 text-[#a99fff]",
  emerald: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
  amber: "border-amber-500/25 bg-amber-500/10 text-amber-300",
  sky: "border-sky-500/25 bg-sky-500/10 text-sky-300",
  rose: "border-rose-500/25 bg-rose-500/10 text-rose-300",
  violet: "border-violet-500/25 bg-violet-500/10 text-violet-300",
} as const

export type StatAccent = keyof typeof ACCENTS

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  hint?: string
  trend?: {
    value: string
    positive?: boolean
  }
  accent?: StatAccent
  className?: string
}

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  trend,
  accent = "indigo",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101116] p-5 transition-colors hover:border-white/[0.12]",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-10 h-32 w-32 rounded-full bg-[#5b4df5]/10 blur-3xl transition-opacity group-hover:opacity-100"
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-[0.12em] text-zinc-500 uppercase">
            {label}
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white tabular-nums">
            {value}
          </p>
        </div>

        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
            ACCENTS[accent]
          )}
        >
          <Icon className="h-[18px] w-[18px]" />
        </div>
      </div>

      {(hint || trend) && (
        <div className="relative mt-4 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-medium",
                trend.positive === false
                  ? "border-rose-500/20 bg-rose-500/10 text-rose-300"
                  : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
              )}
            >
              {trend.positive === false ? (
                <ArrowDownRight className="h-3 w-3" />
              ) : (
                <ArrowUpRight className="h-3 w-3" />
              )}
              {trend.value}
            </span>
          )}
          {hint && <span className="truncate text-zinc-500">{hint}</span>}
        </div>
      )}
    </div>
  )
}
