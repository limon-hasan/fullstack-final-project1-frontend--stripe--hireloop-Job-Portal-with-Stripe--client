import type { Metadata } from "next"
import { Suspense } from "react"

import { getJobs } from "@/lib/api/jobs"
import { BrowseJobsClient } from "./components/BrowseJobsClient"

export const metadata: Metadata = {
  title: "Browse jobs",
  description:
    "Explore curated roles from verified employers. Filter by category, work mode, salary and location.",
}

interface BrowseJobsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

function BrowseJobsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-[68px] animate-pulse rounded-2xl border border-white/[0.06] bg-[#0d0e12]" />
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="hidden h-[420px] w-64 shrink-0 animate-pulse rounded-2xl border border-white/[0.06] bg-[#0d0e12] lg:block xl:w-72" />
        <div className="flex-1 space-y-3.5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-[126px] animate-pulse rounded-2xl border border-white/[0.06] bg-[#0d0e12]"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const BrowseJobsPage = async ({ searchParams }: BrowseJobsPageProps) => {
  const search = await searchParams

  const apiParams = new URLSearchParams()
  if (typeof search.search === "string" && search.search) {
    apiParams.set("search", search.search)
  }
  if (typeof search.location === "string" && search.location) {
    apiParams.set("location", search.location)
  }

  const jobs = await getJobs(apiParams.toString())

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-[#8b81ff] uppercase">
            The board
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Browse open roles
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Transparent salaries, verified employers and filters that actually
            work. Save anything that looks interesting.
          </p>
        </div>

        <Suspense fallback={<BrowseJobsSkeleton />}>
          <BrowseJobsClient jobs={jobs} />
        </Suspense>
      </div>
    </main>
  )
}

export default BrowseJobsPage
