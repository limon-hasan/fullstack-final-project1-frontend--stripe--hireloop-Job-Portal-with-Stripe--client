"use server"
import type { ManagedApplication } from "@/types/applications"
import { authFetch } from "../core/server"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
export const getApplications = async (
    query = ""
): Promise<ManagedApplication[]> => {
    const api = `${BASE_URL}/applications?${query}`
    const res = await authFetch(api)
    const text = await res.text()

    // console.log("GET /applications ->", res.status, text)

    if (!res.ok) return []
    // return res.json()
    return JSON.parse(text)
}

export const getApplicationsCount = async (
    query = ""
): Promise<{ count: number }> => {
    const res = await fetch(`${BASE_URL}/applications/count?${query}`, {
        cache: "no-store",
    })
    return res.json()
}