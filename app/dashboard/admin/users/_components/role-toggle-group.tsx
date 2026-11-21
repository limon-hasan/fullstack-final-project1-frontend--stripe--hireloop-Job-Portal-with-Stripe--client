"use client"

import type { UserRole } from "@/types/users"
import { ROLE_STYLES, USER_ROLES } from "./user-role-config"

interface RoleToggleGroupProps {
  currentRole: UserRole
  onSelectRole: (nextRole: UserRole) => void
  disabled?: boolean
}

export function RoleToggleGroup({
  currentRole,
  onSelectRole,
  disabled = false,
}: RoleToggleGroupProps) {
  return (
    <div
      role="group"
      aria-label="Toggle user role"
      className="inline-flex items-center rounded-xl border border-white/[0.08] bg-[#191a21] p-1"
    >
      {USER_ROLES.map(({ value, label }) => {
        const isActive = currentRole === value
        const activeClasses = ROLE_STYLES[value].activeButton

        return (
          <button
            key={value}
            type="button"
            disabled={disabled || isActive}
            aria-pressed={isActive}
            onClick={() => onSelectRole(value)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              isActive
                ? `${activeClasses} cursor-default`
                : "border-transparent text-zinc-400 hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
