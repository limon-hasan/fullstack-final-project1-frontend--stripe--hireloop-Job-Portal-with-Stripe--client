import React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getJobs } from "@/lib/api/jobs"
import { JobSearchBar } from "@/components/jobs/JobSearchBar"
import { JobFiltersSidebar } from "@/components/jobs/JobFiltersSidebar"
import { JobCard } from "@/components/jobs/JobCard"
import { JobSortSelect } from "@/components/jobs/JobSortSelect"

interface BrowseJobsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const BrowseJobsPage = async ({ searchParams }: BrowseJobsPageProps) => {
  const search = await searchParams
  const urlSearch = new URLSearchParams(search as Record<string, string>)
  const query = urlSearch.toString()

  const jobs = await getJobs(query)

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Top Search Bar */}
        <JobSearchBar />

        {/* Main Content Grid */}
        <div className="flex flex-col items-start gap-6 lg:flex-row">
          {/* Left Filters Sidebar */}
          <JobFiltersSidebar />

          {/* Right Results Section */}
          <section className="w-full flex-1 space-y-4">
            {/* Results Header */}
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <h1 className="text-lg font-semibold text-white">
                Found {jobs.length} Professional Jobs
              </h1>

              <JobSortSelect />
            </div>

            {/* Job Cards List */}
            {jobs.length > 0 ? (
              <div className="space-y-3.5">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-zinc-800/80 bg-[#131417] p-12 text-center">
                <p className="text-sm font-medium text-zinc-300">
                  No jobs matched your current criteria
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  Try adjusting your search keywords or filter selections.
                </p>
              </div>
            )}

            {/* Pagination Shell */}
            {jobs.length > 0 && (
              <div className="flex items-center justify-center gap-1.5 pt-4">
                <button
                  type="button"
                  aria-label="Previous page"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-zinc-800 bg-[#131417] text-zinc-400 hover:border-zinc-700 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-white text-xs font-semibold text-black"
                >
                  1
                </button>
                <button
                  type="button"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-zinc-800 bg-[#131417] text-xs text-zinc-400 hover:border-zinc-700 hover:text-white"
                >
                  2
                </button>
                <button
                  type="button"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-zinc-800 bg-[#131417] text-xs text-zinc-400 hover:border-zinc-700 hover:text-white"
                >
                  3
                </button>
                <button
                  type="button"
                  aria-label="Next page"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-zinc-800 bg-[#131417] text-zinc-400 hover:border-zinc-700 hover:text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

export default BrowseJobsPage
