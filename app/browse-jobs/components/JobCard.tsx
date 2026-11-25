"use client"

import Link from "next/link"
import { Bookmark, Building2, Clock, Globe, MapPin, Tag } from "lucide-react"

import { toast } from "@/components/ui/toast"
import { useSavedJobs } from "@/hooks/use-saved-jobs"
import { formatRelativeTime, formatSalary } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { ManagedJob } from "@/types/jobs"

interface JobCardProps {
  job: ManagedJob
}

export const JobCard = ({ job }: JobCardProps) => {
  const { isSaved, toggleSaved } = useSavedJobs()
  const saved = isSaved(job._id)

  const handleBookmark = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const added = toggleSaved(job)

    toast.add({
      title: added ? "Saved to your list" : "Removed from saved jobs",
      description: added
        ? `${job.title} is now in your saved jobs.`
        : `${job.title} was removed from your saved jobs.`,
    })
  }

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d0e12] transition-all hover:border-white/[0.14] hover:bg-[#101116]">
      <Link
        href={`/browse-jobs/${job._id}`}
        className="block p-5 pr-16 outline-none focus-visible:ring-2 focus-visible:ring-[#5b4df5]/60"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-[linear-gradient(135deg,#1b1c24,#121318)] text-[#b7afff]">
            {job.companyName ? (
              <span className="text-sm font-semibold">
                {job.companyName.charAt(0).toUpperCase()}
              </span>
            ) : (
              <Building2 className="h-5 w-5" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-[15px] font-semibold text-white transition-colors group-hover:text-white">
                {job.title}
              </h3>
              {job.isRemote && (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                  <Globe className="h-2.5 w-2.5" />
                  Remote
                </span>
              )}
            </div>

            <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-[12.5px] text-zinc-400">
              <span className="font-medium text-zinc-300">
                {job.companyName || "Company"}
              </span>
              <span className="text-zinc-600">•</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3 text-zinc-500" />
                {job.location || "Not specified"}
              </span>
            </p>

            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-[#14151b] px-2.5 py-1 text-[11px] font-medium text-zinc-300">
                {formatSalary(job.minSalary, job.maxSalary, job.frequency)}
              </span>

              {job.jobType && (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-[#14151b] px-2.5 py-1 text-[11px] font-medium text-zinc-300">
                  <Clock className="h-3 w-3 text-zinc-500" />
                  {job.jobType}
                </span>
              )}

              {job.category && (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-[#14151b] px-2.5 py-1 text-[11px] font-medium text-zinc-300">
                  <Tag className="h-3 w-3 text-zinc-500" />
                  {job.category}
                </span>
              )}
            </div>
          </div>
        </div>

        {job.postedLabel && (
          <p className="mt-3 pl-[60px] text-[11px] text-zinc-500">
            {formatRelativeTime(job.postedLabel)}
          </p>
        )}
      </Link>

      <button
        type="button"
        onClick={handleBookmark}
        aria-label={saved ? "Remove from saved jobs" : "Save job"}
        aria-pressed={saved}
        className={cn(
          "absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-lg border transition-colors",
          saved
            ? "border-[#5b4df5]/40 bg-[#5b4df5]/15 text-[#c7c1ff]"
            : "border-white/[0.07] bg-[#14151b] text-zinc-500 hover:border-white/20 hover:text-white"
        )}
      >
        <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
      </button>
    </article>
  )
}
