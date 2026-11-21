"use client"

import React from "react"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"

export const JobSearchBar = () => {
  const router = useRouter()
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    console.log(data)
    const search = data.searchField

    const params = new URLSearchParams()
    params.set("search", search as string)
    router.push(`/browse-jobs?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSearchSubmit}
      role="search"
      className="w-full rounded-xl border border-zinc-800/80 bg-[#131417] p-3"
    >
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-500"
          />
          <input
            type="text"
            name="searchField"
            aria-label="Search jobs"
            placeholder="Search by job title, keywords..."
            className="w-full rounded-lg border border-zinc-800 bg-[#0D0E11] py-2.5 pr-4 pl-10 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="shrink-0 cursor-pointer rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
        >
          Search Jobs
        </button>
      </div>
    </form>
  )
}
