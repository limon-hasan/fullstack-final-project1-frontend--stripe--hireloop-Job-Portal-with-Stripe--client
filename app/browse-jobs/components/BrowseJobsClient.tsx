"use client"

import { useMemo } from "react"
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  SearchX,
  SlidersHorizontal,
  X,
} from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { WORK_MODE_OPTIONS } from "@/lib/constants/jobs"
import type { ManagedJob } from "@/types/jobs"
import { JobCard } from "./JobCard"
import { JobFiltersSidebar } from "./JobFiltersSidebar"
import { JobSearchBar } from "./JobSearchBar"
import { JobSortSelect } from "./JobSortSelect"
import { useQueryParams } from "./use-query-params"

const PAGE_SIZE = 6

function getPageWindow(totalPages: number, currentPage: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4))
  return Array.from({ length: 5 }, (_, index) => start + index)
}

export function BrowseJobsClient({ jobs }: { jobs: ManagedJob[] }) {
  const { searchParams, updateParams, getList, toggleListValue } =
    useQueryParams()

  const search = (searchParams.get("search") ?? "").trim().toLowerCase()
  const location = (searchParams.get("location") ?? "").trim().toLowerCase()
  const jobTypes = getList("jobType")
  const workModes = getList("isRemote")
  const categories = getList("category")
  const sort = searchParams.get("sort") ?? "recent"

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (search) {
        const haystack = [
          job.title,
          job.companyName,
          job.category,
          job.jobType,
          job.location,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()

        if (!haystack.includes(search)) return false
      }

      if (location) {
        const locationHaystack =
          `${job.location ?? ""} ${job.isRemote ? "remote" : ""}`.toLowerCase()
        if (!locationHaystack.includes(location)) return false
      }

      if (jobTypes.length > 0 && !jobTypes.includes(job.jobType)) {
        return false
      }

      if (categories.length > 0 && !categories.includes(job.category)) {
        return false
      }

      if (workModes.length > 0) {
        const wantsRemote = workModes.includes("true")
        const wantsOnSite = workModes.includes("false")

        if (wantsRemote && !wantsOnSite && !job.isRemote) return false
        if (wantsOnSite && !wantsRemote && job.isRemote) return false
      }

      return true
    })
  }, [jobs, search, location, jobTypes, categories, workModes])

  const sortedJobs = useMemo(() => {
    const list = [...filteredJobs]

    if (sort === "salary-desc") {
      list.sort(
        (a, b) =>
          (b.maxSalary || b.minSalary || 0) - (a.maxSalary || a.minSalary || 0)
      )
    } else if (sort === "salary-asc") {
      list.sort(
        (a, b) =>
          (a.minSalary || a.maxSalary || 0) - (b.minSalary || b.maxSalary || 0)
      )
    }

    return list
  }, [filteredJobs, sort])

  const totalPages = Math.max(1, Math.ceil(sortedJobs.length / PAGE_SIZE))
  const rawPage = Number(searchParams.get("page") ?? "1")
  const requestedPage =
    Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1
  const currentPage = Math.min(requestedPage, totalPages)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const visibleJobs = sortedJobs.slice(startIndex, startIndex + PAGE_SIZE)

  const activeChips: { key: string; label: string; onRemove: () => void }[] = []

  jobTypes.forEach((value) =>
    activeChips.push({
      key: `jobType-${value}`,
      label: value,
      onRemove: () => toggleListValue("jobType", value),
    })
  )

  workModes.forEach((value) => {
    const label =
      WORK_MODE_OPTIONS.find((option) => option.value === value)?.label ??
      value
    activeChips.push({
      key: `isRemote-${value}`,
      label,
      onRemove: () => toggleListValue("isRemote", value),
    })
  })

  categories.forEach((value) =>
    activeChips.push({
      key: `category-${value}`,
      label: value,
      onRemove: () => toggleListValue("category", value),
    })
  )

  if (search) {
    activeChips.push({
      key: "search",
      label: `“${searchParams.get("search")}”`,
      onRemove: () => updateParams({ search: null }),
    })
  }

  if (location) {
    activeChips.push({
      key: "location",
      label: `in ${searchParams.get("location")}`,
      onRemove: () => updateParams({ location: null }),
    })
  }

  const resetEverything = () =>
    updateParams({
      search: null,
      location: null,
      jobType: null,
      isRemote: null,
      category: null,
      sort: null,
    })

  const goToPage = (page: number) =>
    updateParams({ page: String(page) }, { resetPage: false })

  return (
    <div className="space-y-6">
      <JobSearchBar />

      <div className="flex flex-col items-start gap-6 lg:flex-row">
        <div className="hidden w-full shrink-0 lg:block lg:w-64 xl:w-72">
          <div className="sticky top-24">
            <JobFiltersSidebar />
          </div>
        </div>

        <section className="w-full min-w-0 flex-1 space-y-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-white">
                {sortedJobs.length}{" "}
                {sortedJobs.length === 1 ? "role" : "roles"} found
              </h1>
              <p className="mt-0.5 text-xs text-zinc-500">
                {search || location || activeChips.length > 0
                  ? "Matching your current search and filters."
                  : "Fresh opportunities from verified employers."}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger
                  render={
                    <Button
                      variant="outline"
                      className="h-9 rounded-lg border-white/[0.08] bg-[#14151b] px-3 text-[12px] text-zinc-200 lg:hidden"
                    />
                  }
                >
                  <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
                  Filters
                  {activeChips.length > 0 && (
                    <span className="ml-1.5 rounded-full bg-[#5b4df5]/25 px-1.5 text-[10px] font-semibold text-[#c7c1ff]">
                      {activeChips.length}
                    </span>
                  )}
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[88%] max-w-sm overflow-y-auto border-white/10 bg-[#08080a] p-0 text-white"
                >
                  <SheetHeader className="border-b border-white/[0.07] px-5 py-4">
                    <SheetTitle className="text-sm font-semibold">
                      Filter roles
                    </SheetTitle>
                    <SheetDescription className="text-xs text-zinc-500">
                      Narrow results by type, work mode and category.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="p-4">
                    <JobFiltersSidebar />
                  </div>
                </SheetContent>
              </Sheet>

              <JobSortSelect />
            </div>
          </div>

          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {activeChips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={chip.onRemove}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-[#14151b] px-2.5 py-1 text-[11px] font-medium text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
                >
                  {chip.label}
                  <X className="h-3 w-3 text-zinc-500" />
                </button>
              ))}
              <button
                type="button"
                onClick={resetEverything}
                className="inline-flex items-center gap-1 px-1.5 text-[11px] font-medium text-zinc-500 transition-colors hover:text-white"
              >
                <RotateCcw className="h-3 w-3" />
                Clear all
              </button>
            </div>
          )}

          {visibleJobs.length > 0 ? (
            <>
              <div className="grid gap-3.5">
                {visibleJobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>

              <div className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] pt-4 sm:flex-row">
                <p className="text-[11px] text-zinc-500">
                  Showing {startIndex + 1}–
                  {Math.min(startIndex + PAGE_SIZE, sortedJobs.length)} of{" "}
                  {sortedJobs.length}
                </p>

                {totalPages > 1 && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-[#14151b] text-zinc-400 transition-colors hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    {getPageWindow(totalPages, currentPage).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => goToPage(page)}
                        className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[11px] font-semibold transition-colors ${
                          page === currentPage
                            ? "bg-[#5b4df5] text-white"
                            : "border border-white/[0.08] bg-[#14151b] text-zinc-400 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-[#14151b] text-zinc-400 transition-colors hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <EmptyState
              icon={SearchX}
              title="No roles matched your criteria"
              description="Try a broader keyword, remove a filter, or reset everything to see the full board."
              action={
                <Button
                  onClick={resetEverything}
                  variant="outline"
                  className="h-10 rounded-xl border-white/[0.1] bg-[#14151b] px-4 text-sm text-zinc-200 hover:text-white"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset search
                </Button>
              }
            />
          )}
        </section>
      </div>
    </div>
  )
}
