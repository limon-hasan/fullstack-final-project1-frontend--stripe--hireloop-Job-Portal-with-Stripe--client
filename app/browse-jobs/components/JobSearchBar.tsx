"use client"

import { useSearchParams } from "next/navigation"
import { MapPin, Search, X } from "lucide-react"

import { useQueryParams } from "./use-query-params"

export const JobSearchBar = () => {
  const searchParams = useSearchParams()
  const { updateParams } = useQueryParams()
  const initialSearch = searchParams.get("search") ?? ""
  const initialLocation = searchParams.get("location") ?? ""
  const hasFilters = Boolean(initialSearch || initialLocation)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const search = String(formData.get("search") ?? "").trim()
    const location = String(formData.get("location") ?? "").trim()

    updateParams({
      search: search || null,
      location: location || null,
    })
  }

  return (
    <form
      key={searchParams.toString()}
      onSubmit={handleSubmit}
      role="search"
      className="rounded-2xl border border-white/[0.07] bg-[#0d0e12] p-2 sm:p-2.5"
    >
      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-500"
          />
          <input
            type="text"
            name="search"
            aria-label="Search jobs"
            defaultValue={initialSearch}
            placeholder="Search by job title, skill or company"
            className="h-11 w-full rounded-xl border border-white/[0.06] bg-[#14151b] pr-4 pl-10 text-[13.5px] text-zinc-100 placeholder:text-zinc-500 focus:border-[#5b4df5] focus:outline-none"
          />
        </div>

        <div className="relative sm:w-64">
          <MapPin
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-500"
          />
          <input
            type="text"
            name="location"
            aria-label="Location"
            defaultValue={initialLocation}
            placeholder="City or Remote"
            className="h-11 w-full rounded-xl border border-white/[0.06] bg-[#14151b] pr-4 pl-10 text-[13.5px] text-zinc-100 placeholder:text-zinc-500 focus:border-[#5b4df5] focus:outline-none"
          />
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={() => updateParams({ search: null, location: null })}
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-white/[0.07] bg-transparent px-3 text-xs font-medium text-zinc-400 transition-colors hover:border-white/20 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        )}

        <button
          type="submit"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#6a5cff,#5b4df5)] px-5 text-[13.5px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(91,77,245,0.9)] transition-colors hover:brightness-110"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </div>
    </form>
  )
}
