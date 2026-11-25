"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Search,
  Users,
} from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { toast } from "@/components/ui/toast"
import { updateApplicationStatus } from "@/lib/actions/applications"
import { formatRelativeTime } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { ApplicationStatus, ManagedApplication } from "@/types/applications"

const STATUS_OPTIONS: ApplicationStatus[] = [
  "Applied",
  "Pending",
  "Under Review",
  "Shortlisted",
  "Interview",
  "Offered",
  "Rejected",
]

const STATUS_STYLES: Record<string, string> = {
  Applied: "border-zinc-700/80 bg-zinc-800/70 text-zinc-300",
  Pending: "border-zinc-700/80 bg-zinc-800/70 text-zinc-300",
  Review: "border-amber-500/25 bg-amber-500/10 text-amber-300",
  "Under Review": "border-sky-500/25 bg-sky-500/10 text-sky-300",
  Shortlisted: "border-indigo-500/25 bg-indigo-500/10 text-indigo-300",
  Interview: "border-violet-500/25 bg-violet-500/10 text-violet-300",
  Offered: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
  Rejected: "border-rose-500/25 bg-rose-500/10 text-rose-300",
}

const FILTERS: Array<"All" | ApplicationStatus> = [
  "All",
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview",
  "Offered",
  "Rejected",
]

const PAGE_SIZE = 8

interface RecruiterApplicationsClientProps {
  applications: ManagedApplication[]
}

export function RecruiterApplicationsClient({
  applications: initialApplications,
}: RecruiterApplicationsClientProps) {
  const [applications, setApplications] =
    useState<ManagedApplication[]>(initialApplications)
  const [status, setStatus] = useState<"All" | ApplicationStatus>("All")
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()

    return applications.filter((app) => {
      const matchesStatus =
        status === "All" ||
        app.status === status ||
        (status === "Applied" && app.status === "Pending") ||
        (status === "Under Review" && app.status === "Review")

      const matchesQuery =
        !term ||
        [app.applicantName, app.applicantEmail, app.jobTitle, app.companyName]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term))

      return matchesStatus && matchesQuery
    })
  }, [applications, status, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const visible = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  )

  const handleStatusChange = async (
    application: ManagedApplication,
    nextStatus: ApplicationStatus
  ) => {
    const previous = application.status
    setApplications((prev) =>
      prev.map((item) =>
        item._id === application._id ? { ...item, status: nextStatus } : item
      )
    )
    setUpdatingId(application._id)

    try {
      const result = await updateApplicationStatus(application._id, {
        status: nextStatus,
      })

      if (!result || (result.modifiedCount !== undefined && result.modifiedCount === 0)) {
        throw new Error("The server did not apply the change")
      }

      toast.add({
        title: "Status updated",
        description: `${application.applicantName || application.applicantEmail} is now ${nextStatus}.`,
      })
    } catch (error) {
      setApplications((prev) =>
        prev.map((item) =>
          item._id === application._id ? { ...item, status: previous } : item
        )
      )
      toast.add({
        title: "Could not update status",
        description:
          error instanceof Error ? error.message : "Please try again.",
      })
    } finally {
      setUpdatingId(null)
    }
  }

  if (initialApplications.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No applications yet"
        description="Applications for every job you post will land here. Share your listings to get the first candidates in."
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-[#101116] p-3 lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-1.5">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => {
                setStatus(filter)
                setPage(1)
              }}
              className={cn(
                "cursor-pointer rounded-lg px-3 py-1.5 text-[11.5px] font-medium transition-colors",
                status === filter
                  ? "bg-white text-black"
                  : "bg-[#15161d] text-zinc-400 hover:text-white"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:ml-auto lg:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(1)
            }}
            placeholder="Search name, email or role…"
            aria-label="Search applications"
            className="h-10 w-full rounded-lg border border-white/[0.08] bg-[#0d0e12] pr-3 pl-9 text-[12.5px] text-white placeholder-zinc-500 transition-colors focus:border-[#5b4df5]/50 focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101116]">
        {visible.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-[#15161d] text-[10px] font-semibold tracking-[0.12em] text-zinc-500 uppercase">
                    <th className="px-6 py-3.5">Applicant</th>
                    <th className="px-4 py-3.5">Role</th>
                    <th className="px-4 py-3.5">Applied</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05] text-[13px]">
                  {visible.map((app) => (
                    <tr
                      key={app._id}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.07] bg-[#191a22] text-[11px] font-semibold text-zinc-200">
                            {(app.applicantName || app.applicantEmail || "A")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-white">
                              {app.applicantName || "Applicant"}
                            </p>
                            <p className="truncate text-[11px] text-zinc-500">
                              {app.applicantEmail || "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <Link
                          href={`/dashboard/recruiter/jobs/${app.jobId}/applications`}
                          className="font-medium text-zinc-200 transition-colors hover:text-white"
                        >
                          {app.jobTitle || "Role"}
                        </Link>
                        <p className="mt-0.5 text-[11px] text-zinc-500">
                          {app.companyName || "—"}
                        </p>
                      </td>

                      <td className="px-4 py-3.5 text-[11.5px] text-zinc-400">
                        <span suppressHydrationWarning>
                          {formatRelativeTime(app.appliedAt)}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={cn(
                            "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium",
                            STATUS_STYLES[app.status] ?? STATUS_STYLES.Applied
                          )}
                        >
                          {app.status}
                        </span>
                      </td>

                      <td className="px-6 py-3.5 text-right">
                        <div className="relative inline-block">
                          <select
                            aria-label={`Update status for ${app.applicantName || app.applicantEmail}`}
                            value={app.status}
                            disabled={updatingId === app._id}
                            onChange={(event) =>
                              handleStatusChange(
                                app,
                                event.target.value as ApplicationStatus
                              )
                            }
                            className="h-8 cursor-pointer rounded-lg border border-white/[0.1] bg-[#191a21] px-2.5 text-[11.5px] font-medium text-zinc-200 transition-colors hover:border-white/20 focus:border-[#5b4df5] focus:outline-none disabled:cursor-wait disabled:opacity-60"
                          >
                            {STATUS_OPTIONS.includes(app.status) ? null : (
                              <option value={app.status}>{app.status}</option>
                            )}
                            {STATUS_OPTIONS.map((option) => (
                              <option
                                key={option}
                                value={option}
                                className="bg-[#121318] text-zinc-100"
                              >
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] px-6 py-4 sm:flex-row">
              <p className="inline-flex items-center gap-2 text-[11.5px] text-zinc-500">
                <Users className="h-3.5 w-3.5" />
                Showing {(safePage - 1) * PAGE_SIZE + 1}–
                {Math.min(safePage * PAGE_SIZE, filtered.length)} of{" "}
                {filtered.length}
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  disabled={safePage === 1}
                  aria-label="Previous page"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-white/[0.08] bg-[#15161d] text-zinc-400 transition-colors hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-2 text-[11.5px] font-medium text-zinc-400 tabular-nums">
                  {safePage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setPage((value) => Math.min(totalPages, value + 1))
                  }
                  disabled={safePage === totalPages}
                  aria-label="Next page"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-white/[0.08] bg-[#15161d] text-zinc-400 transition-colors hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-6">
            <EmptyState
              compact
              icon={Search}
              title="No matching applications"
              description="Try a different status filter or clear the search field."
            />
          </div>
        )}
      </div>
    </div>
  )
}
