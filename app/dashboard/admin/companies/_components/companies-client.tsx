"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowUpRight,
  Building2,
  Globe,
  MapPin,
  Search,
} from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { cn } from "@/lib/utils"

export interface AdminCompany {
  name: string
  jobs: number
  activeJobs: number
  applicants: number
  categories: string[]
  locations: string[]
  isRemote: boolean
  latestRole: string
  latestRoleId: string
}

interface CompaniesClientProps {
  companies: AdminCompany[]
}

type SortKey = "jobs" | "applicants" | "name"

export function CompaniesClient({ companies }: CompaniesClientProps) {
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<SortKey>("jobs")

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    const result = companies.filter(
      (company) =>
        !term ||
        company.name.toLowerCase().includes(term) ||
        company.categories.some((category) =>
          category.toLowerCase().includes(term)
        ) ||
        company.locations.some((location) =>
          location.toLowerCase().includes(term)
        )
    )

    return result.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name)
      if (sort === "applicants") return b.applicants - a.applicants
      return b.jobs - a.jobs
    })
  }, [companies, query, sort])

  if (companies.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="No companies yet"
        description="Companies appear here automatically once recruiters publish their first job listing."
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-[#101116] p-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search companies, industries or cities…"
            aria-label="Search companies"
            className="h-10 w-full rounded-lg border border-white/[0.08] bg-[#0d0e12] pr-3 pl-9 text-[12.5px] text-white placeholder-zinc-500 transition-colors focus:border-[#5b4df5]/50 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 sm:ml-auto">
          {(
            [
              { key: "jobs", label: "Most roles" },
              { key: "applicants", label: "Applicants" },
              { key: "name", label: "A–Z" },
            ] as Array<{ key: SortKey; label: string }>
          ).map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setSort(option.key)}
              className={cn(
                "cursor-pointer rounded-lg px-3 py-1.5 text-[11.5px] font-medium transition-colors",
                sort === option.key
                  ? "bg-white text-black"
                  : "bg-[#15161d] text-zinc-400 hover:text-white"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((company) => (
            <article
              key={company.name}
              className="flex flex-col rounded-2xl border border-white/[0.07] bg-[#101116] p-5 transition-colors hover:border-white/[0.12]"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-[linear-gradient(135deg,#1b1c24,#121318)] text-sm font-semibold text-[#b7afff]">
                  {company.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-[14px] font-semibold text-white">
                    {company.name}
                  </h3>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-zinc-500">
                    {company.isRemote && (
                      <>
                        <Globe className="h-3 w-3" />
                        Remote-friendly
                        <span className="text-zinc-700">•</span>
                      </>
                    )}
                    <span>{company.categories[0] || "General"}</span>
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                  {company.activeJobs} active
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-white/[0.06] bg-[#0d0e12] px-3 py-2.5">
                  <p className="text-[10px] tracking-wide text-zinc-500 uppercase">
                    Listings
                  </p>
                  <p className="mt-0.5 text-base font-semibold text-white tabular-nums">
                    {company.jobs}
                  </p>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-[#0d0e12] px-3 py-2.5">
                  <p className="text-[10px] tracking-wide text-zinc-500 uppercase">
                    Applicants
                  </p>
                  <p className="mt-0.5 text-base font-semibold text-white tabular-nums">
                    {company.applicants}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {company.locations.slice(0, 2).map((location) => (
                  <span
                    key={location}
                    className="inline-flex items-center gap-1 rounded-full border border-white/[0.07] bg-[#15161d] px-2 py-0.5 text-[10px] font-medium text-zinc-400"
                  >
                    <MapPin className="h-2.5 w-2.5" />
                    {location}
                  </span>
                ))}
                {company.categories.slice(0, 1).map((category) => (
                  <span
                    key={category}
                    className="rounded-full border border-white/[0.07] bg-[#15161d] px-2 py-0.5 text-[10px] font-medium text-zinc-400"
                  >
                    {category}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex items-center justify-between gap-2 border-t border-white/[0.06] pt-3.5">
                <Link
                  href={`/browse-jobs/${company.latestRoleId}`}
                  className="min-w-0 text-[11.5px] text-zinc-500 transition-colors hover:text-zinc-300"
                >
                  <span className="block text-[10px] tracking-wide uppercase">
                    Latest role
                  </span>
                  <span className="block truncate font-medium text-zinc-300">
                    {company.latestRole}
                  </span>
                </Link>
                <Link
                  href={`/dashboard/admin/jobs?company=${encodeURIComponent(company.name)}`}
                  className="inline-flex h-8 shrink-0 items-center gap-1 rounded-lg border border-white/[0.08] bg-[#15161d] px-2.5 text-[11px] font-medium text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
                >
                  Jobs
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          compact
          icon={Search}
          title="No companies match your search"
          description="Try a different company name, industry or location."
        />
      )}
    </div>
  )
}
