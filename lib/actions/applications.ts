"use server"

import type { JobApplicationPayload } from "@/types/applications"
import { authFetch, protectedMutation } from "../core/server"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const createApplication = async (data: JobApplicationPayload) => {
    const api = `${BASE_URL}/applications`;
    const res = await protectedMutation(api, "POST", data)
    return res.json()
}

export const updateApplicationStatus = async (
    id: string,
    data: { status: string }
) => {
    const response = await protectedMutation(
        `${BASE_URL}/applications/${id}`,
        "PATCH",
        data
    )

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to update application status")
    }

    return response.json()
}