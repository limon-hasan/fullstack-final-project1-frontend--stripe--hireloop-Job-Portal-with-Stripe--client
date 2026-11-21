import type { ApplicationStatus } from "@/types/applications"

export const RECRUITER_STATUS_OPTIONS: ApplicationStatus[] = [
    "Applied",
    "Pending",
    "Under Review",
    "Shortlisted",
    "Interview",
    "Offered",
    "Rejected",
]

export const STATUS_STYLES: Record<
    ApplicationStatus,
    { badge: string; dot: string }
> = {
    Applied: {
        badge: "border-zinc-500/25 bg-zinc-500/10 text-zinc-200",
        dot: "bg-zinc-300",
    },
    Pending: {
        badge: "border-amber-500/20 bg-amber-500/10 text-amber-400",
        dot: "bg-amber-400",
    },
    Review: {
        badge: "border-sky-500/20 bg-sky-500/10 text-sky-400",
        dot: "bg-sky-400",
    },
    "Under Review": {
        badge: "border-sky-500/20 bg-sky-500/10 text-sky-400",
        dot: "bg-sky-400",
    },
    Shortlisted: {
        badge: "border-indigo-500/20 bg-indigo-500/10 text-indigo-400",
        dot: "bg-indigo-400",
    },
    Interview: {
        badge: "border-purple-500/20 bg-purple-500/10 text-purple-400",
        dot: "bg-purple-400",
    },
    Offered: {
        badge: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
        dot: "bg-emerald-400",
    },
    Rejected: {
        badge: "border-rose-500/20 bg-rose-500/10 text-rose-400",
        dot: "bg-rose-400",
    },
}