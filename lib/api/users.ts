
"use server"
import { authFetch } from "../core/server"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const getUsers = async () => {
    const res = await authFetch(`${BASE_URL}/users`)
    return res.json()
}
export const getUserPremiumbyId = async (userId: string) => {
    const response = await fetch(`${BASE_URL}/users/${userId}/premium`)
    return response.json()
}