import { cn } from "@/lib/utils"

interface BrandSpinnerProps {
  label?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const SIZE_MAP = {
  sm: "h-5 w-5 border-2",
  md: "h-8 w-8 border-[2.5px]",
  lg: "h-11 w-11 border-[3px]",
}

export function BrandSpinner({
  label,
  size = "md",
  className,
}: BrandSpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label || "Loading"}
      className={cn("inline-flex flex-col items-center gap-3", className)}
    >
      <div className="relative flex items-center justify-center">
        <span
          className={cn(
            "animate-spin rounded-full border-white/10 border-t-[#5b4df5] border-r-[#8b81ff]/60",
            SIZE_MAP[size]
          )}
        />
        <span className="absolute h-2 w-2 rounded-full bg-[#8b81ff]/80 blur-[1px]" />
      </div>
      {label ? (
        <p className="text-xs font-medium tracking-wide text-zinc-400">
          {label}
        </p>
      ) : null}
    </div>
  )
}

export function SkeletonBox({
  className,
}: {
  className?: string
}) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-white/[0.05]",
        className
      )}
    />
  )
}

