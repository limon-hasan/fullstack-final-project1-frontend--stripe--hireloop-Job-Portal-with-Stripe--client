"use client"

import { Check } from "lucide-react"

import type { FilterOption } from "@/lib/constants/jobs"

interface FilterCheckboxGroupProps {
  title: string
  name: string
  options: FilterOption[]
  selectedValues: string[]
  onToggle: (name: string, value: string) => void
}

export const FilterCheckboxGroup = ({
  title,
  name,
  options,
  selectedValues,
  onToggle,
}: FilterCheckboxGroupProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-[12px] font-semibold tracking-wide text-zinc-300">
        {title}
      </h3>

      <div className="space-y-1">
        {options.map((option) => {
          const id = `${name}-${option.value}`
          const isChecked = selectedValues.includes(option.value)

          return (
            <label
              key={option.value}
              htmlFor={id}
              className="group flex cursor-pointer items-center gap-2.5 rounded-lg px-1.5 py-1.5 select-none hover:bg-white/[0.03]"
            >
              <span className="relative flex items-center justify-center">
                <input
                  id={id}
                  type="checkbox"
                  name={name}
                  value={option.value}
                  onChange={() => onToggle(name, option.value)}
                  checked={isChecked}
                  className="peer h-4 w-4 appearance-none rounded border border-white/20 bg-transparent transition-colors group-hover:border-white/40 checked:border-[#6a5cff] checked:bg-[#5b4df5]"
                />
                <Check
                  className="pointer-events-none absolute h-3 w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                  strokeWidth={3}
                />
              </span>

              <span className="text-[12.5px] text-zinc-400 transition-colors group-hover:text-zinc-200">
                {option.label}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
