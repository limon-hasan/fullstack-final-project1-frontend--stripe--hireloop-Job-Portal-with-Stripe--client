import type { ApplicationStatus } from "@/types/applications"
import { STATUS_STYLES } from "./application-status"

interface StatusBadgeProps {
  status: ApplicationStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.Pending

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${style.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  )
}
