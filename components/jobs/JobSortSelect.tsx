"use client"

import React from "react"
import { SORT_OPTIONS } from "@/lib/constants/jobs"

export const JobSortSelect = () => {
  const handleSortChange = (_e: React.ChangeEvent<HTMLSelectElement>) => {
    // TODO: Implement sort query update
  }

  return (
    <div className="flex items-center gap-2.5">
      <span className="text-xs text-zinc-400">Sort by:</span>
      <select
        name="sortBy"
        onChange={handleSortChange}
        defaultValue="recent"
        className="cursor-pointer rounded-lg border border-zinc-800 bg-[#131417] px-3 py-2 text-xs text-zinc-200 focus:border-zinc-600 focus:outline-none"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
