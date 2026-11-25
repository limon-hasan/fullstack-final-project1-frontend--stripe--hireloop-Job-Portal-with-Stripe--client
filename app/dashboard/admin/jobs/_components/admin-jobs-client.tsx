"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowUpRight,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
} from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { formatDate, formatSalary } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { ManagedJob } from "@/types/jobs"

const PAGE_SIZE = 10

const STATUS_FILTERS = ["All", "Active", "Expired"] as const
type StatusFilter = (typeof STATUS_FILTERS)[number]

interface AdminJobsClientProps {
  jobs: ManagedJob[]
  initialCompany?: string
}

export function AdminJobsClient({
  jobs,
  initialCompany = "",
}: AdminJobsClientProps) {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<StatusFilter>("All")
  const [company, setCompany] = useState(initialCompany)
  const [page, setPage] = useState(1)

  const companies = useMemo(
    () =>
      Array.from(
        new Set(jobs.map((job) => job.companyName).filter(Boolean))
      ).sort(),
    [jobs]
  )

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()

    return jobs.filter((job) => {
      const matchesStatus = status === "All" || job.status === status
      const matchesCompany = !company || job.companyName === company
      const matchesQuery =
        !term ||
        [job.title, job.companyName, job.category, job.location, job.jobType]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term))

      return matchesStatus && matchesCompany && matchesQuery
    })
  }, [jobs, status, company, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const visible = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-[#101116] p-3 lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-1.5">
          {STATUS_FILTERS.map((filter) => (
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

        <div className="flex flex-1 flex-col gap-2 sm:flex-row lg:justify-end">
          <select
            value={company}
            onChange={(event) => {
              setCompany(event.target.value)
              setPage(1)
            }}
            aria-label="Filter by company"
            className="h-10 cursor-pointer rounded-lg border border-white/[0.08] bg-[#0d0e12] px-3 text-[12.5px] text-zinc-300 transition-colors focus:border-[#5b4df5]/50 focus:outline-none"
          >
            <option value="">All companies</option>
            {companies.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
              placeholder="Search roles, locations…"
              aria-label="Search jobs"
              className="h-10 w-full rounded-lg border border-white/[0.08] bg-[#0d0e12] pr-3 pl-9 text-[12.5px] text-white placeholder-zinc-500 transition-colors focus:border-[#5b4df5]/50 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101116]">
        {visible.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-[#15161d] text-[10px] font-semibold tracking-[0.12em] text-zinc-500 uppercase">
                    <th className="px-6 py-3.5">Role</th>
                    <th className="px-4 py-3.5">Company</th>
                    <th className="px-4 py-3.5">Type</th>
                    <th className="px-4 py-3.5">Salary</th>
                    <th className="px-4 py-3.5">Applicants</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Deadline</th>
                    <th className="px-6 py-3.5 text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05] text-[13px]">
                  {visible.map((job) => (
                    <tr
                      key={job._id}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-3.5">
                        <p className="font-medium text-white">{job.title}</p>
                        <p className="mt-0.5 text-[11px] text-zinc-500">
                          {job.category}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-zinc-200">
                          {job.companyName || "—"}
                        </p>
                        <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-zinc-500">
                          <MapPin className="h-2.5 w-2.5" />
                          {job.isRemote ? "Remote" : job.location || "—"}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 text-zinc-400">
                        {job.jobType}
                      </td>
                      <td className="px-4 py-3.5 text-zinc-300">
                        {formatSalary(
                          job.minSalary,
                          job.maxSalary,
                          job.frequency
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-zinc-300 tabular-nums">
                        {job.applicantsCount}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
                            job.status === "Active"
                              ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                              : "border-white/[0.08] bg-white/[0.04] text-zinc-400"
                          )}
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              job.status === "Active"
                                ? "bg-emerald-400"
                                : "bg-zinc-500"
                            )}
                          />
                          {job.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-[11.5px] text-zinc-400">
                        {formatDate(job.deadline)}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <Link
                          href={`/browse-jobs/${job._id}`}
                          aria-label={`View ${job.title}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-[#15161d] text-zinc-400 transition-colors hover:border-white/20 hover:text-white"
                        >
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] px-6 py-4 sm:flex-row">
              <p className="text-[11.5px] text-zinc-500">
                Showing {(safePage - 1) * PAGE_SIZE + 1}–
                {Math.min(safePage * PAGE_SIZE, filtered.length)} of{" "}
                {filtered.length} listings
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
              icon={jobs.length === 0 ? Briefcase : Search}
              title={
                jobs.length === 0
                  ? "No job listings yet"
                  : "No listings match your filters"
              }
              description={
                jobs.length === 0
                  ? "Recruiters have not published any roles yet."
                  : "Try clearing the company filter or searching for a different role."
              }
            />
          </div>
        )}
      </div>
    </div>
  )
}
