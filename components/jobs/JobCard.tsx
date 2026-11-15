"use client"

import React from "react"
import { Banknote, Bookmark, Building2, Clock, Globe, Tag } from "lucide-react"
import type { ManagedJob } from "@/types/jobs"

interface JobCardProps {
  job: ManagedJob
}

const formatSalary = (min?: number, max?: number) => {
  if (!min && !max) return "Negotiable"
  const formatNum = (n: number) =>
    n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`

  if (min && max) return `${formatNum(min)} - ${formatNum(max)}`
  return formatNum(min || max || 0)
}

export const JobCard = ({ job }: JobCardProps) => {
  const handleBookmarkClick = () => {
    // TODO: Implement save/bookmark job action
  }

  return (
    <article className="group rounded-xl border border-zinc-800/80 bg-[#131417] p-5 transition-colors hover:border-zinc-700">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {/* Company Logo Placeholder */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-[#1A1C21] text-zinc-400">
            <Building2 className="h-5 w-5" />
          </div>

          {/* Job Info */}
          <div>
            <h3 className="text-base font-semibold text-white transition-colors group-hover:text-zinc-200">
              {job.title}
            </h3>

            <p className="mt-0.5 text-sm text-zinc-400">
              {job.companyName} • {job.location}
              {job.isRemote ? " (Remote)" : ""}
            </p>

            {/* Metadata Pills */}
            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-[#1A1C21] px-2.5 py-1 text-xs text-zinc-300">
                <Banknote className="h-3.5 w-3.5 text-zinc-400" />
                {formatSalary(job.minSalary, job.maxSalary)}
              </span>

              {job.jobType && (
                <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-[#1A1C21] px-2.5 py-1 text-xs text-zinc-300">
                  <Clock className="h-3.5 w-3.5 text-zinc-400" />
                  {job.jobType}
                </span>
              )}

              {job.category && (
                <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-[#1A1C21] px-2.5 py-1 text-xs text-zinc-300">
                  <Tag className="h-3.5 w-3.5 text-zinc-400" />
                  {job.category}
                </span>
              )}

              {job.isRemote && (
                <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-400">
                  <Globe className="h-3.5 w-3.5" />
                  Remote
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bookmark Action */}
        <button
          type="button"
          onClick={handleBookmarkClick}
          aria-label="Bookmark job"
          className="cursor-pointer rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-800/60 hover:text-zinc-200"
        >
          <Bookmark className="h-4 w-4" />
        </button>
      </div>
    </article>
  )
}
