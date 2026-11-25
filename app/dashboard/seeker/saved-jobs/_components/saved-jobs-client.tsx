"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Bookmark, Search, Trash2 } from "lucide-react"

import { JobCard } from "@/app/browse-jobs/components/JobCard"
import { BrandButton } from "@/components/shared/brand-button"
import { EmptyState } from "@/components/shared/empty-state"
import { toast } from "@/components/ui/toast"
import { useSavedJobs } from "@/hooks/use-saved-jobs"

export function SavedJobsClient() {
  const { savedJobs, isReady, clearSaved } = useSavedJobs()
  const [query, setQuery] = useState("")

  const filteredJobs = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return savedJobs

    return savedJobs.filter((job) =>
      [job.title, job.companyName, job.location, job.category, job.jobType]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    )
  }, [savedJobs, query])

  const handleClear = () => {
    clearSaved()
    toast.add({
      title: "Saved jobs cleared",
      description: "Your saved list is now empty.",
    })
  }

  if (!isReady) {
    return (
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-[150px] animate-pulse rounded-2xl border border-white/[0.06] bg-[#101116]"
          />
        ))}
      </div>
    )
  }

  if (savedJobs.length === 0) {
    return (
      <EmptyState
        icon={Bookmark}
        title="No saved jobs yet"
        description="Tap the bookmark icon on any job card to keep it here for later. Saved jobs live in this browser."
        action={
          <BrandButton
            nativeButton={false}
            render={<Link href="/browse-jobs" />}
          >
            Browse open roles
          </BrandButton>
        }
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-[#101116] p-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search saved jobs…"
            aria-label="Search saved jobs"
            className="h-10 w-full rounded-lg border border-white/[0.08] bg-[#0d0e12] pr-3 pl-9 text-[13px] text-white placeholder-zinc-500 transition-colors focus:border-[#5b4df5]/50 focus:outline-none"
          />
        </div>

        <p className="text-xs text-zinc-500 sm:ml-1">
          {filteredJobs.length} of {savedJobs.length} saved
        </p>

        <button
          type="button"
          onClick={handleClear}
          className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 text-[12.5px] font-medium text-rose-300 transition-colors hover:bg-rose-500/15 sm:ml-auto"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear all
        </button>
      </div>

      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {filteredJobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      ) : (
        <EmptyState
          compact
          icon={Search}
          title="No saved jobs match your search"
          description="Try a different keyword or clear the search field."
        />
      )}
    </div>
  )
}
