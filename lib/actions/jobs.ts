"use server"
import type { JobPayload } from "@/types/jobs"
import { protectedMutation } from "../core/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const createJob = async (data: JobPayload) => {
  const api = `${BASE_URL}/jobs`;
  const res = await protectedMutation(api, "POST", data)
  return res.json()
}

export const deleteJob = async (jobId: string) => {
  const res = await fetch(`${BASE_URL}/jobs/${jobId}`, {
    method: "DELETE",
  })
  return res.json()
}
