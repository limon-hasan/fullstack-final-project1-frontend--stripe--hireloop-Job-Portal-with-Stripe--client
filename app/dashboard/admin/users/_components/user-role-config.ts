import type { UserRole } from "@/types/users"

export const USER_ROLES: { value: UserRole; label: string }[] = [
    { value: "seeker", label: "Seeker" },
    { value: "recruiter", label: "Recruiter" },
    { value: "admin", label: "Admin" },
]

export const ROLE_STYLES: Record<
    UserRole,
    { badge: string; dot: string; activeButton: string }
> = {
    admin: {
        badge: "border-purple-500/25 bg-purple-500/10 text-purple-300",
        dot: "bg-purple-400",
        activeButton:
            "border-purple-500/40 bg-purple-500/20 text-purple-200 shadow-sm",
    },
    recruiter: {
        badge: "border-sky-500/25 bg-sky-500/10 text-sky-300",
        dot: "bg-sky-400",
        activeButton: "border-sky-500/40 bg-sky-500/20 text-sky-200 shadow-sm",
    },
    seeker: {
        badge: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
        dot: "bg-emerald-400",
        activeButton:
            "border-emerald-500/40 bg-emerald-500/20 text-emerald-200 shadow-sm",
    },
}