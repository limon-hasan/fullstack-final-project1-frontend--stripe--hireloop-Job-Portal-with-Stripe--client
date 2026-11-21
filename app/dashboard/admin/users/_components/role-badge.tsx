import type { UserRole } from "@/types/users"
import { ROLE_STYLES, USER_ROLES } from "./user-role-config"

interface RoleBadgeProps {
  role: UserRole
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const style = ROLE_STYLES[role] ?? ROLE_STYLES.seeker
  const label = USER_ROLES.find((item) => item.value === role)?.label ?? role

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${style.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {label}
    </span>
  )
}
