import type { ManagedJob } from "@/types/jobs"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const getJobs = async (query = ""): Promise<ManagedJob[]> => {
  const res = await fetch(`${BASE_URL}/jobs?${query}`)
  return res.json()
}

export const getJobById = async (id: string): Promise<ManagedJob | null> => {
  const res = await fetch(`${BASE_URL}/jobs/${id}`, {
    cache: "no-store",
  })

  if (!res.ok) return null
  return res.json()
}

// export const createJob = async (data: JobPayload) => {
//   const res = await fetch(`${BASE_URL}/jobs`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   })
//   return res.json()
// }