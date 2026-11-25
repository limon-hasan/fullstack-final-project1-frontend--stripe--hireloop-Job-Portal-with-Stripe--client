"use server"

import type { ManagedApplication } from "@/types/applications"
import { authFetch } from "../core/server"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

function normalizeApplications(payload: unknown): ManagedApplication[] {
  if (Array.isArray(payload)) return payload as ManagedApplication[]
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>
    if (Array.isArray(record.applications)) {
      return record.applications as ManagedApplication[]
    }
    if (Array.isArray(record.data)) return record.data as ManagedApplication[]
  }
  return []
}

export const getApplications = async (
  query = ""
): Promise<ManagedApplication[]> => {
  const suffix = query && !query.startsWith("?") ? `?${query}` : query

  try {
    const res = await authFetch(`${BASE_URL}/applications${suffix}`)
    if (!res.ok) return []
    return normalizeApplications(await res.json())
  } catch {
    return []
  }
}

export const getApplicationsCount = async (
  query = ""
): Promise<{ count: number }> => {
  const suffix = query && !query.startsWith("?") ? `?${query}` : query

  try {
    const res = await fetch(`${BASE_URL}/applications/count${suffix}`, {
      cache: "no-store",
    })
    if (!res.ok) return { count: 0 }

    const payload = (await res.json()) as { count?: number }
    return { count: typeof payload.count === "number" ? payload.count : 0 }
  } catch {
    return { count: 0 }
  }
}
