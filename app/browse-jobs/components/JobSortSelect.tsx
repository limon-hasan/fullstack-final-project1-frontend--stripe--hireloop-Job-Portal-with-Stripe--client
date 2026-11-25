"use client"

import { ArrowUpDown } from "lucide-react"

import { SORT_OPTIONS } from "@/lib/constants/jobs"
import { useQueryParams } from "./use-query-params"

export const JobSortSelect = () => {
  const { searchParams, updateParams } = useQueryParams()
  const value = searchParams.get("sort") ?? "recent"

  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-500">
        <ArrowUpDown className="h-3.5 w-3.5" />
        Sort
      </span>
      <select
        name="sort"
        aria-label="Sort jobs"
        value={value}
        onChange={(event) => updateParams({ sort: event.target.value })}
        className="h-9 cursor-pointer rounded-lg border border-white/[0.08] bg-[#14151b] px-3 text-[12px] text-zinc-200 outline-none focus:border-[#5b4df5]"
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
