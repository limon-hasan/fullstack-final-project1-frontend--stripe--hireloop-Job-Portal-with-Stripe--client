"use server"

import type { JobPayload } from "@/types/jobs"
import { protectedMutation } from "../core/server"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const createJob = async (data: JobPayload) => {
  const res = await protectedMutation(`${BASE_URL}/jobs`, "POST", data)
  return res.json()
}

export const updateJob = async (jobId: string, data: Partial<JobPayload>) => {
  const res = await protectedMutation(
    `${BASE_URL}/jobs/${jobId}`,
    "PATCH",
    data
  )

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || "Failed to update job")
  }

  return res.json()
}

export const deleteJob = async (jobId: string) => {
  const res = await protectedMutation(`${BASE_URL}/jobs/${jobId}`, "DELETE")

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || "Failed to delete job")
  }

  return res.json()
}
