"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  MapPin,
  Search,
  Sparkles,
  Star,
  Users2,
} from "lucide-react"

import globeImg from "@/app/images/globe.png"
import { BrandButton } from "@/components/shared/brand-button"
import type { ManagedJob } from "@/types/jobs"

const trendingTags = [
  { label: "Product Designer", query: "Product Designer" },
  { label: "AI Engineering", query: "AI Engineering" },
  { label: "DevOps Engineer", query: "DevOps Engineer" },
  { label: "Remote", query: "" },
]

const statIcons = [Briefcase, Building2, Users2, Star]

const starField = {
  backgroundImage: [
    "radial-gradient(1px 1px at 22px 38px, rgba(255,255,255,0.85) 50%, transparent 51%)",
    "radial-gradient(1.5px 1.5px at 118px 86px, rgba(255,255,255,0.7) 50%, transparent 51%)",
    "radial-gradient(1px 1px at 74px 176px, rgba(255,255,255,0.6) 50%, transparent 51%)",
    "radial-gradient(1px 1px at 180px 24px, rgba(255,255,255,0.45) 50%, transparent 51%)",
  ].join(", "),
  backgroundSize: "260px 260px, 340px 340px, 300px 300px, 220px 220px",
}

export function Hero({ jobs = [] }: { jobs?: ManagedJob[] }) {
  const router = useRouter()
  const [role, setRole] = React.useState("")
  const [location, setLocation] = React.useState("")
  const [liveIndex, setLiveIndex] = React.useState(0)

  const liveUpdates = React.useMemo(() => {
    const items: Array<{ label: string; highlight: string; href: string }> =
      jobs.slice(0, 6).map((job) => ({
        label: `Live role · ${job.title}`,
        highlight: `${job.companyName} · ${job.isRemote ? "Remote" : job.location || "On-site"}`,
        href: `/browse-jobs/${job._id}`,
      }))

    if (items.length === 0) {
      items.push({
        label: "Live board active",
        highlight: "Verified employers hiring across 48 countries",
        href: "/browse-jobs",
      })
    }
    return items
  }, [jobs])

  React.useEffect(() => {
    if (liveUpdates.length <= 1) return
    const timer = window.setInterval(() => {
      setLiveIndex((prev) => (prev + 1) % liveUpdates.length)
    }, 3500)
    return () => window.clearInterval(timer)
  }, [liveUpdates.length])

  const activeUpdate = liveUpdates[liveIndex % liveUpdates.length]

  const liveStats = React.useMemo(() => {
    const activeJobsCount = jobs.filter((j) => j.status !== "Expired").length
    const companiesCount = new Set(
      jobs.map((j) => j.companyName).filter(Boolean)
    ).size
    const remoteCount = jobs.filter((j) => j.isRemote).length
    const totalApplicants = jobs.reduce(
      (sum, j) => sum + (j.applicantsCount || 0),
      0
    )

    return [
      {
        label: "Live open roles",
        value: activeJobsCount > 0 ? activeJobsCount : "50K+",
      },
      {
        label: "Hiring teams",
        value: companiesCount > 0 ? companiesCount : "12K+",
      },
      {
        label: "Remote roles",
        value: remoteCount > 0 ? remoteCount : "2M+",
      },
      {
        label: "Active applicants",
        value: totalApplicants > 0 ? totalApplicants : "97%",
      },
    ]
  }, [jobs])

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()

    const params = new URLSearchParams()
    if (role.trim()) params.set("search", role.trim())
    if (location.trim()) params.set("location", location.trim())

    router.push(`/browse-jobs${params.size ? `?${params.toString()}` : ""}`)
  }

  return (
    <section className="relative isolate overflow-hidden pt-16 pb-10 text-white sm:pt-24 lg:pt-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_50%_at_50%_0%,rgba(91,77,245,0.18),transparent_72%)]" />
        <div className="absolute top-[26%] left-1/2 h-[620px] w-[1100px] -translate-x-1/2 rounded-[100%] bg-[#4b3ee8]/16 blur-[150px]" />
        <div
          className="absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,transparent,black_26%,black_70%,transparent)]"
          style={starField}
        />
      </div>

      <div className="relative mx-auto flex max-w-[1240px] flex-col items-center px-4 text-center sm:px-6">
        <div className="mb-7 flex flex-wrap items-center justify-center gap-2">
          <Link
            href={activeUpdate.href}
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#12131a]/80 px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-zinc-300 backdrop-blur transition-colors hover:border-[#5b4df5]/40"
          >
            <span className="hireloop-pulse h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
            <span className="font-semibold text-white">
              {activeUpdate.label}
            </span>
            <span className="hidden text-zinc-500 sm:inline">•</span>
            <span className="hidden max-w-[220px] truncate text-zinc-400 sm:inline">
              {activeUpdate.highlight}
            </span>
            <ArrowRight className="h-3 w-3 shrink-0 text-[#a99fff]" />
          </Link>
          <span className="hidden items-center gap-1.5 rounded-full border border-[#5b4df5]/30 bg-[#5b4df5]/10 px-3 py-1.5 text-[11px] font-medium text-[#b7afff] backdrop-blur sm:inline-flex">
            <Sparkles className="h-3 w-3" />
            Real-time job feed
          </span>
        </div>

        <h1 className="max-w-4xl text-[38px] leading-[1.05] font-semibold tracking-[-0.035em] text-balance text-slate-900 dark:text-white sm:text-[56px] lg:text-[64px]">
          Find your next role,
          <span className="bg-[linear-gradient(100deg,#1e1b4b_10%,#5b4df5_52%,#7c3aed_92%)] dark:bg-[linear-gradient(100deg,#ffffff_10%,#cfcaff_52%,#8b81ff_92%)] bg-clip-text text-transparent">
            {" "}
            at your pace
          </span>
        </h1>

        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-pretty text-zinc-400 sm:text-[17px]">
          HireLoop connects ambitious people with teams doing meaningful work.
          Search transparent roles, apply in one click, and track every stage
          in a single place.
        </p>

        <form
          onSubmit={handleSearch}
          className="mt-9 flex w-full max-w-3xl flex-col items-stretch gap-1.5 rounded-2xl border border-white/[0.08] bg-[#0d0e13]/90 p-1.5 shadow-[0_24px_70px_-24px_rgba(0,0,0,0.95)] backdrop-blur-xl sm:flex-row sm:items-center sm:rounded-2xl"
        >
          <div className="flex h-12 w-full items-center gap-3 rounded-xl px-4 sm:h-14 sm:w-1/2">
            <Search className="size-[18px] shrink-0 text-zinc-500" />
            <input
              type="text"
              placeholder="Job title, skill or company"
              aria-label="Job title, skill or company"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="h-full w-full bg-transparent text-[15px] text-white placeholder-zinc-500 outline-none"
            />
          </div>

          <div className="hidden h-8 w-px shrink-0 bg-white/10 sm:block" />

          <div className="flex h-12 w-full items-center gap-3 rounded-xl px-4 sm:h-14 sm:w-1/2">
            <MapPin className="size-[18px] shrink-0 text-zinc-500" />
            <input
              type="text"
              placeholder="City or Remote"
              aria-label="City or Remote"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="h-full w-full bg-transparent text-[15px] text-white placeholder-zinc-500 outline-none"
            />
          </div>

          <BrandButton
            type="submit"
            className="h-12 w-full shrink-0 rounded-xl px-5 sm:h-14 sm:w-auto"
          >
            <Search className="mr-2 size-[18px]" />
            Search roles
          </BrandButton>
        </form>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="text-[13px] text-zinc-500">Trending:</span>
          {trendingTags.map((tag) => (
            <Link
              key={tag.label}
              href={
                tag.query
                  ? `/browse-jobs?search=${encodeURIComponent(tag.query)}`
                  : "/browse-jobs?isRemote=true"
              }
              className="rounded-full border border-white/[0.07] bg-[#111218] px-3 py-1.5 text-[12px] font-medium text-zinc-300 transition-colors hover:border-[#5b4df5]/50 hover:bg-[#17182a] hover:text-white"
            >
              {tag.label}
            </Link>
          ))}
        </div>

        <div className="mt-12 grid w-full max-w-4xl grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {liveStats.map((stat, index) => {
            const Icon = statIcons[index] ?? Star
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/[0.07] bg-[#0d0e12]/70 px-4 py-4 text-left backdrop-blur transition-colors hover:border-white/[0.14]"
              >
                <div className="flex items-center gap-2 text-zinc-500">
                  <Icon className="h-3.5 w-3.5" />
                  <span className="text-[11px] font-medium tracking-wide">
                    {stat.label}
                  </span>
                </div>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
                  {stat.value}
                </p>
              </div>
            )
          })}
        </div>

        <div className="keep-dark relative mt-10 w-full max-w-[1400px] overflow-hidden rounded-3xl border border-slate-200/80 bg-[#090a0f] shadow-2xl shadow-indigo-950/15 dark:border-transparent dark:bg-transparent dark:shadow-none">
          <div className="relative mx-auto aspect-[4/3] w-full overflow-hidden sm:aspect-[16/9]">
            <Image
              src={globeImg}
              alt="Global network of hiring teams"
              priority
              className="absolute top-0 left-1/2 w-[112%] max-w-none -translate-x-1/2 -translate-y-[30%] object-contain mix-blend-screen"
            />

            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-[#08080a] via-[#08080a]/70 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-36 bg-gradient-to-t from-[#08080a] via-[#08080a]/60 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#08080a] to-transparent sm:w-28" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#08080a] to-transparent sm:w-28" />

            <div className="absolute top-[40%] left-1/2 z-20 w-full max-w-[740px] -translate-x-1/2 px-4 text-center sm:top-[42%]">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0d0e13]/70 px-3 py-1.5 text-[11px] font-medium text-zinc-300 backdrop-blur">
                <BadgeCheck className="h-3.5 w-3.5 text-emerald-400" />
                Verified employers in 48 countries
              </div>
              <h2 className="text-2xl leading-[1.25] font-semibold tracking-tight text-balance text-white sm:text-3xl lg:text-[36px]">
                Helping over 15,000 people find work
                <br className="hidden sm:block" /> they are excited about.
              </h2>
              <Link
                href="/browse-jobs"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#b7afff] transition-colors hover:text-white"
              >
                Explore open roles
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
