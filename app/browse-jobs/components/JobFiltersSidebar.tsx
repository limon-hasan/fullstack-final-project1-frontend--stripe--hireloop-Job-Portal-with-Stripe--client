"use client"

import { RotateCcw, SlidersHorizontal } from "lucide-react"

import {
  CATEGORY_OPTIONS,
  JOB_TYPE_OPTIONS,
  WORK_MODE_OPTIONS,
} from "@/lib/constants/jobs"
import { cn } from "@/lib/utils"
import { FilterCheckboxGroup } from "./FilterCheckboxGroup"
import { useQueryParams } from "./use-query-params"

interface JobFiltersSidebarProps {
  className?: string
}

export const JobFiltersSidebar = ({ className }: JobFiltersSidebarProps) => {
  const { getList, toggleListValue, clearAll } = useQueryParams()

  const jobTypes = getList("jobType")
  const workModes = getList("isRemote")
  const categories = getList("category")
  const activeCount =
    jobTypes.length + workModes.length + categories.length

  return (
    <aside className={cn("w-full shrink-0 lg:w-64 xl:w-72", className)}>
      <div className="space-y-5 rounded-2xl border border-white/[0.07] bg-[#0d0e12] p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-[#a99fff]" />
            <h2 className="text-sm font-semibold text-white">Filters</h2>
            {activeCount > 0 && (
              <span className="rounded-full bg-[#5b4df5]/20 px-1.5 py-0.5 text-[10px] font-semibold text-[#c7c1ff]">
                {activeCount}
              </span>
            )}
          </div>

          {activeCount > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 transition-colors hover:text-white"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          )}
        </div>

        <FilterCheckboxGroup
          title="Job type"
          name="jobType"
          options={JOB_TYPE_OPTIONS}
          selectedValues={jobTypes}
          onToggle={toggleListValue}
        />

        <div className="border-t border-white/[0.06] pt-5">
          <FilterCheckboxGroup
            title="Work mode"
            name="isRemote"
            options={WORK_MODE_OPTIONS}
            selectedValues={workModes}
            onToggle={toggleListValue}
          />
        </div>

        <div className="border-t border-white/[0.06] pt-5">
          <FilterCheckboxGroup
            title="Category"
            name="category"
            options={CATEGORY_OPTIONS}
            selectedValues={categories}
            onToggle={toggleListValue}
          />
        </div>

        <div className="rounded-xl border border-[#5b4df5]/20 bg-[#5b4df5]/[0.06] p-3.5">
          <p className="text-[11px] leading-relaxed text-zinc-400">
            Tip: you can combine filters. Results update instantly without
            reloading the page.
          </p>
        </div>
      </div>
    </aside>
  )
}
