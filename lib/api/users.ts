"use server"

import { authFetch } from "../core/server"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const getUsers = async () => {
  try {
    const res = await authFetch(`${BASE_URL}/users`)
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export const getUserPremiumbyId = async (
  userId: string
): Promise<{ premium: boolean }> => {
  if (!userId) return { premium: false }

  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/premium`, {
      cache: "no-store",
    })
    if (!response.ok) return { premium: false }

    const payload = (await response.json()) as { premium?: boolean }
    return { premium: Boolean(payload.premium) }
  } catch {
    return { premium: false }
  }
}
