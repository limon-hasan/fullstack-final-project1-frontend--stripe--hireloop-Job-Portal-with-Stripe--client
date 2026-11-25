export const STORAGE_KEYS = {
  savedJobs: "hireloop.saved-jobs",
  companyProfile: "hireloop.company-profile",
  platformSettings: "hireloop.platform-settings",
  jobDraft: "hireloop.job-draft",
} as const

export const STORAGE_EVENT = "hireloop:storage"

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback

  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    window.dispatchEvent(new Event(STORAGE_EVENT))
  } catch {
    // Storage can be unavailable in private mode or when the quota is full.
  }
}

export function removeStorage(key: string) {
  if (typeof window === "undefined") return

  try {
    window.localStorage.removeItem(key)
    window.dispatchEvent(new Event(STORAGE_EVENT))
  } catch {
    // Ignore storage failures.
  }
}
