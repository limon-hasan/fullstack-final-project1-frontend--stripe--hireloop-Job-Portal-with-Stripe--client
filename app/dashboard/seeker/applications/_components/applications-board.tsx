"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  Banknote,
  Bot,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Code2,
  Database,
  Download,
  PenTool,
  Search,
} from "lucide-react"
import { toast } from "@/components/ui/toast"
import type {
  ApplicationStatus,
  ManagedApplication,
} from "@/types/applications"

interface ApplicationsBoardProps {
  applications: ManagedApplication[]
}

const STATUS_TABS: Array<"All" | ApplicationStatus> = [
  "All",
  "Applied",
  "Review",
  "Shortlisted",
  "Offered",
  "Rejected",
]

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Applied: "border-zinc-700/80 bg-zinc-800/80 text-zinc-300",
  Pending: "border-zinc-700/80 bg-zinc-800/80 text-zinc-300",
  Review: "border-amber-500/30 bg-amber-500/15 text-amber-400",
  "Under Review": "border-amber-500/30 bg-amber-500/15 text-amber-400",
  Shortlisted: "border-blue-500/30 bg-blue-500/15 text-blue-400",
  Interview: "border-amber-500/30 bg-amber-500/15 text-amber-400",
  Offered: "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
  Rejected: "border-rose-500/30 bg-rose-500/15 text-rose-400",
}

const ROLE_ICONS = [Code2, PenTool, Database, Cloud, Bot]

const ITEMS_PER_PAGE = 5

const formatSalary = (min?: number, max?: number) => {
  if (!min && !max) return "Negotiable"
  const formatNum = (n: number) =>
    n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`

  if (min && max) return `${formatNum(min)} – ${formatNum(max)}`
  return formatNum(min || max || 0)
}

const formatRelativeTime = (isoDate?: string) => {
  if (!isoDate) return "Recently"
  const diffMs = Date.now() - new Date(isoDate).getTime()
  const minutes = Math.floor(diffMs / (1000 * 60))
  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes} ${minutes === 1 ? "min" : "mins"} ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} ${days === 1 ? "day" : "days"} ago`

  const weeks = Math.floor(days / 7)
  return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`
}

export const ApplicationsBoard = ({ applications }: ApplicationsBoardProps) => {
  const [viewMode, setViewMode] = useState<"active" | "archived">("active")
  const [selectedStatus, setSelectedStatus] = useState<
    "All" | ApplicationStatus
  >("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const stats = useMemo(() => {
    const total = applications.length
    const shortlisted = applications.filter(
      (app) => app.status === "Shortlisted"
    ).length
    const interviews = applications.filter(
      (app) => app.status === "Interview" || app.status === "Review"
    ).length
    const positiveOutcomes = applications.filter((app) =>
      ["Shortlisted", "Interview", "Offered"].includes(app.status)
    ).length
    const successRate =
      total > 0 ? Math.round((positiveOutcomes / total) * 100) : 0

    return { total, shortlisted, interviews, successRate }
  }, [applications])

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesArchive =
        viewMode === "archived" ? Boolean(app.archived) : !app.archived

      const matchesStatus =
        selectedStatus === "All" ||
        app.status === selectedStatus ||
        (selectedStatus === "Applied" && app.status === "Pending") ||
        (selectedStatus === "Review" && app.status === "Under Review")

      const query = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !query ||
        app.jobTitle.toLowerCase().includes(query) ||
        app.companyName.toLowerCase().includes(query) ||
        (app.location && app.location.toLowerCase().includes(query))

      return matchesArchive && matchesStatus && matchesSearch
    })
  }, [applications, viewMode, selectedStatus, searchQuery])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredApplications.length / ITEMS_PER_PAGE)
  )
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE
  const paginatedApplications = filteredApplications.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  )

  const handleExportPdf = () => {
    toast.add({
      title: "Preparing PDF export",
      description: "Use your browser print dialog to save as PDF.",
    })
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            My Applications
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Track your job applications and interview progress in real-time.
          </p>
        </div>

        {/* Right Controls: Active/Archived Toggle + Export PDF + Browse Jobs */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-lg border border-zinc-800 bg-[#131417] p-1">
            <button
              type="button"
              onClick={() => {
                setViewMode("active")
                setCurrentPage(1)
              }}
              className={`cursor-pointer rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "active"
                  ? "bg-[#1F2128] text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode("archived")
                setCurrentPage(1)
              }}
              className={`cursor-pointer rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "archived"
                  ? "bg-[#1F2128] text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Archived
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportPdf}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-zinc-200"
          >
            <Download className="h-3.5 w-3.5" />
            Export PDF
          </button>

          <Link
            href="/browse-jobs"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-[#131417] px-3.5 py-2 text-xs font-medium text-zinc-200 transition-colors hover:border-zinc-700 hover:text-white"
          >
            <Briefcase className="h-3.5 w-3.5" />
            Browse Jobs
          </Link>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-800/80 bg-[#131417] p-5">
          <span className="text-xs font-medium text-zinc-400">
            Total Applied
          </span>
          <p className="mt-2.5 text-2xl font-bold text-white">{stats.total}</p>
        </div>

        <div className="rounded-xl border border-zinc-800/80 bg-[#131417] p-5">
          <span className="text-xs font-medium text-zinc-400">Shortlisted</span>
          <p className="mt-2.5 text-2xl font-bold text-white">
            {stats.shortlisted}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800/80 bg-[#131417] p-5">
          <span className="text-xs font-medium text-zinc-400">Interviews</span>
          <p className="mt-2.5 text-2xl font-bold text-amber-400">
            {stats.interviews}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800/80 bg-[#131417] p-5">
          <span className="text-xs font-medium text-zinc-400">
            Success Rate
          </span>
          <p className="mt-2.5 text-2xl font-bold text-emerald-400">
            {stats.successRate}%
          </p>
        </div>
      </div>

      {/* Status Filter Pills & Search Bar */}
      <div className="flex flex-col justify-between gap-3 rounded-xl border border-zinc-800/80 bg-[#131417] p-4 lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-1.5">
          {STATUS_TABS.map((tab) => {
            const active = selectedStatus === tab
            return (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setSelectedStatus(tab)
                  setCurrentPage(1)
                }}
                className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "bg-white text-black"
                    : "bg-[#1A1C21] text-zinc-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            )
          })}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            placeholder="Search applications..."
            className="w-full rounded-lg border border-zinc-800 bg-[#1A1C21] py-2 pr-3 pl-9 text-xs text-white placeholder-zinc-500 focus:border-zinc-700 focus:outline-none"
          />
        </div>
      </div>

      {/* Applications Table / Empty State */}
      {paginatedApplications.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-zinc-800/80 bg-[#131417]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-zinc-800/80 text-xs font-medium text-zinc-500">
                  <th className="px-6 py-4">Job Title</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Salary</th>
                  <th className="px-6 py-4">Applied</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-800/80 text-sm">
                {paginatedApplications.map((app, index) => {
                  const RoleIcon = ROLE_ICONS[index % ROLE_ICONS.length]
                  const isRejected = app.status === "Rejected"
                  const badgeStyle =
                    STATUS_STYLES[app.status] || STATUS_STYLES.Applied

                  return (
                    <tr
                      key={app._id}
                      className="transition-colors hover:bg-[#1A1C21]/50"
                    >
                      {/* Job Title + Metadata */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
                              isRejected
                                ? "border-rose-500/30 bg-rose-950/50 text-rose-400"
                                : "border-zinc-800 bg-[#1A1C21] text-zinc-300"
                            }`}
                          >
                            <RoleIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <Link
                              href={`/browse-jobs/${app.jobId}`}
                              className="font-semibold text-white transition-colors hover:text-zinc-300"
                            >
                              {app.jobTitle}
                            </Link>
                            <p className="mt-0.5 text-xs text-zinc-500">
                              {app.jobType || "Full-time"} •{" "}
                              {app.isRemote ? "Remote" : "On-site"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Company */}
                      <td className="px-6 py-4 font-medium text-zinc-200">
                        {app.companyName}
                      </td>

                      {/* Salary */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-300">
                          <Banknote className="h-3.5 w-3.5 text-zinc-500" />
                          {formatSalary(app.minSalary, app.maxSalary)}
                        </span>
                      </td>

                      {/* Applied Relative Time */}
                      <td className="px-6 py-4 text-xs text-zinc-400">
                        {formatRelativeTime(app.appliedAt)}
                      </td>

                      {/* Status Pill */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${badgeStyle}`}
                        >
                          {app.status || "Pending"}
                        </span>
                      </td>

                      {/* Details Action */}
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/browse-jobs/${app.jobId}`}
                          className="text-xs font-medium text-zinc-300 transition-colors hover:text-white"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-zinc-800/80 px-6 py-4 sm:flex-row">
            <p className="text-xs text-zinc-500">
              Showing {startIndex + 1}-
              {Math.min(
                startIndex + ITEMS_PER_PAGE,
                filteredApplications.length
              )}{" "}
              of {filteredApplications.length} applications
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                aria-label="Previous page"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-zinc-800 bg-[#1A1C21] text-zinc-400 transition-colors hover:border-zinc-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-xs font-semibold transition-colors ${
                      safePage === page
                        ? "bg-white text-black"
                        : "border border-zinc-800 bg-[#1A1C21] text-zinc-400 hover:border-zinc-700 hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={safePage === totalPages}
                aria-label="Next page"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-zinc-800 bg-[#1A1C21] text-zinc-400 transition-colors hover:border-zinc-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-800/80 bg-[#131417] p-12 text-center">
          <p className="text-sm font-medium text-zinc-300">
            No {viewMode} applications found
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Try switching tabs, clearing your search, or applying to new jobs.
          </p>
        </div>
      )}
    </div>
  )
}
