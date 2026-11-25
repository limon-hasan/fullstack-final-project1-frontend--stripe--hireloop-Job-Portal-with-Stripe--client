import type * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function BrandButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn(
        "h-11 rounded-xl border border-[#6f63ff]/40 bg-[linear-gradient(135deg,#6a5cff_0%,#5b4df5_55%,#4b3ee8_100%)] px-6 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(91,77,245,0.95),inset_0_1px_0_rgba(255,255,255,0.18)] transition-[transform,box-shadow,background] duration-200 hover:-translate-y-px hover:shadow-[0_14px_36px_-10px_rgba(91,77,245,1),inset_0_1px_0_rgba(255,255,255,0.24)] focus-visible:border-[#a99fff] focus-visible:ring-[#5b4df5]/40 active:translate-y-0 disabled:translate-y-0 disabled:opacity-60",
        className
      )}
      {...props}
    />
  )
}
