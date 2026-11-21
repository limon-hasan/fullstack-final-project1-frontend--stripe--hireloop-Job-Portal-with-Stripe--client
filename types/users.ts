export type UserRole = "admin" | "recruiter" | "seeker"

export interface AdminUser {
    id: string
    name: string
    email: string
    image?: string | null
    role: UserRole
    emailVerified: boolean
    banned: boolean
    banReason?: string | null
    createdAt: string
}