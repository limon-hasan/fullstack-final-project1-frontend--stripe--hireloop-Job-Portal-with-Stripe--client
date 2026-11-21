"use client"

import React from "react"
import { Check } from "lucide-react"
import type { FilterOption } from "@/lib/constants/jobs"
// import { router } from "better-auth/api"
import { useRouter } from "next/navigation"

interface FilterCheckboxGroupProps {
  title: string
  name: string
  options: FilterOption[]
  selectedValue: string
  onChange: (name: string, value: string, checked: boolean) => void
}

export const FilterCheckboxGroup = ({
  title,
  name,
  options,
  selectedValue,
  onChange,
}: FilterCheckboxGroupProps) => {
  const router = useRouter()
  const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(name, e.target.value, "Checked")
    onChange(name, e.target.value, e.target.checked)

    const params = new URLSearchParams(window.location.search)
    params.set(name, e.target.value)
    router.push(`/browse-jobs?${params.toString()}`)
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-zinc-200">{title}</h3>

      <div className="space-y-2.5">
        {options.map((option) => {
          const id = `${name}-${option.value}`
          const isChecked = selectedValue === option.value

          return (
            <label
              key={option.value}
              htmlFor={id}
              className="group flex cursor-pointer items-center gap-3 select-none"
            >
              <div className="relative flex items-center justify-center">
                <input
                  id={id}
                  type="checkbox"
                  name={name}
                  value={option.value}
                  onChange={handleCheckBoxChange}
                  checked={isChecked}
                  //   onChange={(e) =>
                  //     onChange(name, option.value, e.target.checked)
                  //   }
                  className="peer h-4 w-4 appearance-none rounded border border-zinc-700 bg-transparent transition-colors group-hover:border-zinc-500 checked:border-white checked:bg-white"
                />
                <Check
                  className="pointer-events-none absolute h-3 w-3 text-black opacity-0 transition-opacity peer-checked:opacity-100"
                  strokeWidth={3}
                />
              </div>

              <span className="text-sm text-zinc-400 transition-colors group-hover:text-zinc-200">
                {option.label}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
