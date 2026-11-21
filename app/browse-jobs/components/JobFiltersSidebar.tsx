"use client"

import React, { useState } from "react"
import { FilterCheckboxGroup } from "./FilterCheckboxGroup"
import {
  CATEGORY_OPTIONS,
  JOB_TYPE_OPTIONS,
  WORK_MODE_OPTIONS,
} from "@/lib/constants/jobs"

export const JobFiltersSidebar = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    jobType: "",
    isRemote: "",
    category: "",
  })

  const handleFilterChange = (
    filterKey: string,
    value: string,
    checked: boolean
  ) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterKey]: checked ? value : "",
    }))

    // TODO: Implement URL query update when filter changes
  }

  return (
    <aside className="w-full shrink-0 lg:w-64 xl:w-72">
      <div className="space-y-6 rounded-xl border border-zinc-800/80 bg-[#131417] p-5">
        <h2 className="text-lg font-semibold text-white">Filters</h2>

        <FilterCheckboxGroup
          title="Job Type"
          name="jobType"
          options={JOB_TYPE_OPTIONS}
          selectedValue={selectedFilters.jobType}
          onChange={handleFilterChange}
        />

        <div className="border-t border-zinc-800/80 pt-5">
          <FilterCheckboxGroup
            title="Work Mode"
            name="isRemote"
            options={WORK_MODE_OPTIONS}
            selectedValue={selectedFilters.isRemote}
            onChange={handleFilterChange}
          />
        </div>

        <div className="border-t border-zinc-800/80 pt-5">
          <FilterCheckboxGroup
            title="Category"
            name="category"
            options={CATEGORY_OPTIONS}
            selectedValue={selectedFilters.category}
            onChange={handleFilterChange}
          />
        </div>
      </div>
    </aside>
  )
}
