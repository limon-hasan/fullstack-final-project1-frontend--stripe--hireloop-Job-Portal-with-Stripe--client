"use client"

import React from "react"
import { Search } from "lucide-react"

export const JobSearchBar = () => {
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: Implement search query update on submit
    
  }

  const handleInputChange = (_e: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: Implement input change handler if needed
  }

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="w-full rounded-xl border border-zinc-800/80 bg-[#131417] p-3"
    >
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            name="search"
            onChange={handleInputChange}
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
