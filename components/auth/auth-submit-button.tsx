"use client"

import type * as React from "react"
import { Loader2 } from "lucide-react"

import { BrandButton } from "@/components/shared/brand-button"
import { cn } from "@/lib/utils"

interface AuthSubmitButtonProps extends React.ComponentProps<
  typeof BrandButton
> {
  loading: boolean
  loadingLabel: string
}

export function AuthSubmitButton({
  loading,
  loadingLabel,
  disabled,
  className,
  children,
  ...props
}: AuthSubmitButtonProps) {
  return (
    <BrandButton
      type="submit"
      disabled={loading || disabled}
      className={cn(
        "mt-2 w-full disabled:cursor-not-allowed disabled:opacity-70",
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="size-4 animate-spin" />
          {loadingLabel}
        </span>
      ) : (
        children
      )}
    </BrandButton>
  )
}
