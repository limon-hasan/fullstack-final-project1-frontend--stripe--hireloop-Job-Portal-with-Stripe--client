import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface SectionCardProps {
  title: string
  description?: string
  icon?: LucideIcon
  action?: React.ReactNode
  className?: string
  contentClassName?: string
  children: React.ReactNode
}

export function SectionCard({
  title,
  description,
  icon: Icon,
  action,
  className,
  contentClassName,
  children,
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101116]",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-6 py-4">
        <div className="flex min-w-0 items-center gap-3">
          {Icon && (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#5b4df5]/25 bg-[#5b4df5]/10 text-[#a99fff]">
              <Icon className="h-4 w-4" />
            </span>
          )}
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-white">
              {title}
            </h2>
            {description && (
              <p className="mt-0.5 truncate text-xs text-zinc-500">
                {description}
              </p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      <div className={cn("space-y-5 p-6", contentClassName)}>{children}</div>
    </section>
  )
}
