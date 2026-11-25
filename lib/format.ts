const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

export function formatSalary(
  min?: number | null,
  max?: number | null,
  frequency?: string | null
) {
  if (!min && !max) return "Negotiable"

  const formatAmount = (value: number) =>
    value >= 1000 ? `$${Math.round(value / 1000)}k` : `$${value}`

  const range =
    min && max
      ? `${formatAmount(min)} – ${formatAmount(max)}`
      : formatAmount(min || max || 0)

  const suffix =
    frequency === "per year"
      ? "/yr"
      : frequency === "per month"
        ? "/mo"
        : frequency === "per hour"
          ? "/hr"
          : ""

  return suffix ? `${range} ${suffix}` : range
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value)
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatDate(value?: string | Date | null) {
  if (!value) return "—"
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return "—"

  return `${MONTHS[date.getMonth()]} ${String(date.getDate()).padStart(2, "0")}, ${date.getFullYear()}`
}

export function formatDateTime(value?: string | Date | null) {
  if (!value) return "—"
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return "—"

  return `${formatDate(date)} · ${date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })}`
}

export function formatRelativeTime(value?: string | Date | null) {
  if (!value) return "Recently"
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return "Recently"

  const diffMs = Date.now() - date.getTime()
  const minutes = Math.floor(diffMs / (1000 * 60))

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes} ${minutes === 1 ? "min" : "mins"} ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} ${days === 1 ? "day" : "days"} ago`

  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`

  return formatDate(date)
}

export function getInitials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || "U"
  const parts = source.split(/\s+/).filter(Boolean)

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }

  return source.slice(0, 2).toUpperCase()
}

export function truncate(value: string, max = 120) {
  if (value.length <= max) return value
  return `${value.slice(0, max).trimEnd()}…`
}

export function toSentenceCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
