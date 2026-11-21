"use server"
import { protectedMutation } from "../core/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const updateUserRole = async (userId: string, role: "seeker" | "recruiter" | "admin") => {
    const api = `${BASE_URL}/users/${userId}/role`;
    const res = await protectedMutation(api, "PATCH", { role })
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update user role");
    }
    return res.json()
}


