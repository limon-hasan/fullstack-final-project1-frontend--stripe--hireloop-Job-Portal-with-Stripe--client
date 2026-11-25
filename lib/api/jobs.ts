import type { ManagedJob } from "@/types/jobs"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

function normalizeJobs(payload: unknown): ManagedJob[] {
  if (Array.isArray(payload)) return payload as ManagedJob[]
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>
    if (Array.isArray(record.jobs)) return record.jobs as ManagedJob[]
    if (Array.isArray(record.data)) return record.data as ManagedJob[]
    if (Array.isArray(record.results)) return record.results as ManagedJob[]
  }
  return []
}

export const getJobs = async (query = ""): Promise<ManagedJob[]> => {
  const suffix = query && !query.startsWith("?") ? `?${query}` : query

  try {
    const res = await fetch(`${BASE_URL}/jobs${suffix}`, { cache: "no-store" })
    if (!res.ok) return []
    return normalizeJobs(await res.json())
  } catch {
    return []
  }
}

export const getJobById = async (id: string): Promise<ManagedJob | null> => {
  if (!id) return null

  try {
    const res = await fetch(`${BASE_URL}/jobs/${id}`, {
      cache: "no-store",
    })

    if (!res.ok) return null

    const payload = (await res.json()) as unknown
    if (payload && typeof payload === "object" && "job" in payload) {
      return (payload as { job: ManagedJob }).job
    }

    return payload as ManagedJob
  } catch {
    return null
  }
}
