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
        "h-11 rounded-xl bg-[#5b4df5] px-6 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(91,77,245,0.9)] hover:bg-[#6c5ff7] focus-visible:border-[#8b81ff] focus-visible:ring-[#5b4df5]/40",
        className
      )}
      {...props}
    />
  )
}
