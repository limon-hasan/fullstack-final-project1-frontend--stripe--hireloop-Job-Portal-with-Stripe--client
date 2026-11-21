"use client"

import { ChevronDown } from "lucide-react"
import type { ApplicationStatus } from "@/types/applications"
import { RECRUITER_STATUS_OPTIONS } from "./application-status"

interface StatusSelectProps {
  value: ApplicationStatus
  onChange: (nextStatus: ApplicationStatus) => void
  disabled?: boolean
}

export function StatusSelect({
  value,
  onChange,
  disabled = false,
}: StatusSelectProps) {
  const options = RECRUITER_STATUS_OPTIONS.includes(value)
    ? RECRUITER_STATUS_OPTIONS
    : [value, ...RECRUITER_STATUS_OPTIONS]

  return (
    <div className="relative inline-block">
      <select
        aria-label="Update application status"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as ApplicationStatus)}
        className="h-8 cursor-pointer appearance-none rounded-lg border border-white/[0.1] bg-[#191a21] pr-8 pl-3 text-xs font-medium text-zinc-200 transition-colors hover:border-white/20 focus:border-[#5b4df5] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        {options.map((statusOption) => (
          <option
            key={statusOption}
            value={statusOption}
            className="bg-[#121318] text-zinc-100"
          >
            {statusOption}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
    </div>
  )
}
