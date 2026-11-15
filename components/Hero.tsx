"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Search,
  MapPin,
  Briefcase,
  Building2,
  Users2,
  Star,
} from "lucide-react"

import globeImg from "@/app/images/globe.png"
import { BrandButton } from "@/components/shared/brand-button"

const trendingTags = [
  { label: "Product Designer", href: "/jobs?query=Product+Designer" },
  { label: "AI Engineering", href: "/jobs?query=AI+Engineering" },
  { label: "Dev-ops Engineer", href: "/jobs?query=Dev-ops+Engineer" },
]

const stats = [
  {
    icon: Briefcase,
    value: "50K",
    label: "Active Jobs",
  },
  {
    icon: Building2,
    value: "12K",
    label: "Companies",
  },
  {
    icon: Users2,
    value: "2M",
    label: "Job Seekers",
  },
  {
    icon: Star,
    value: "97%",
    label: "Satisfaction Rate",
  },
]

const starField = {
  backgroundImage: [
    "radial-gradient(1px 1px at 22px 38px, rgba(255,255,255,0.85) 50%, transparent 51%)",
    "radial-gradient(1.5px 1.5px at 118px 86px, rgba(255,255,255,0.7) 50%, transparent 51%)",
    "radial-gradient(1px 1px at 74px 176px, rgba(255,255,255,0.6) 50%, transparent 51%)",
    "radial-gradient(1px 1px at 180px 24px, rgba(255,255,255,0.45) 50%, transparent 51%)",
  ].join(", "),
  backgroundSize: "260px 260px, 340px 340px, 300px 300px, 220px 220px",
}

export function Hero() {
  const [role, setRole] = React.useState("")
  const [location, setLocation] = React.useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ role, location })
  }

  return (
    <section className="relative isolate overflow-hidden pt-20 pb-20 text-white sm:pt-28 sm:pb-24 lg:pt-40">
      {/* Ambient background: purple aura + starfield */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_70%,rgba(60,48,180,0.16),transparent_72%)]" />
        <div className="absolute top-[42%] left-1/2 h-[720px] w-[1250px] -translate-x-1/2 rounded-[100%] bg-[#4b3ee8]/20 blur-[150px]" />
        <div
          className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_88%,transparent)] opacity-50"
          style={starField}
        />
      </div>

      <div className="relative mx-auto flex max-w-[1300px] flex-col items-center px-4 text-center sm:px-6">
        {/* Top Pill Badge */}
        <div className="relative mb-8 flex items-center justify-center sm:mb-14">
          <div className="absolute inset-x-[-70px] top-1/2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent sm:inset-x-[-110px]" />

          <div className="relative z-10 flex items-center gap-2.5 rounded-full border border-white/10 bg-[#141416]/90 px-4 py-2.5 shadow-[0_0_24px_rgba(255,255,255,0.04)] backdrop-blur-md sm:px-6 sm:py-3">
            <span className="text-sm">💼</span>
            <span className="text-[11px] font-semibold tracking-[0.14em] text-neutral-300 uppercase sm:text-xs">
              <strong className="font-bold text-white">50,000+</strong> NEW JOBS
              THIS MONTH
            </span>
          </div>
        </div>

        {/* Main Title */}
        <h1 className="max-w-4xl text-[38px] leading-[1.1] font-bold tracking-[-0.03em] text-white sm:text-[52px] md:text-[56px]">
          Find Your Dream Job Today
        </h1>

        {/* Subtitle */}
        <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-neutral-400 sm:text-[17px]">
          HireLoop connects top talent with world-class companies. Browse
          thousands of curated opportunities and land your next role — faster.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="mt-9 flex w-full max-w-3xl flex-col items-stretch gap-1.5 rounded-2xl border border-white/10 bg-[#101013]/90 p-1.5 shadow-[0_18px_60px_-20px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:flex-row sm:items-center sm:rounded-full"
        >
          <div className="flex h-12 w-full items-center gap-3 rounded-full px-4 sm:h-14 sm:w-1/2">
            <Search className="size-[18px] shrink-0 text-neutral-500" />
            <input
              type="text"
              placeholder="Job title, skill or company"
              aria-label="Job title, skill or company"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="h-full w-full bg-transparent text-[15px] text-white placeholder-neutral-500 outline-none"
            />
          </div>

          <div className="hidden h-7 w-px shrink-0 bg-white/10 sm:block" />

          <div className="flex h-12 w-full items-center gap-3 rounded-full px-4 sm:h-14 sm:w-1/2">
            <MapPin className="size-[18px] shrink-0 text-neutral-500" />
            <input
              type="text"
              placeholder="Location or Remote"
              aria-label="Location or Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-full w-full bg-transparent text-[15px] text-white placeholder-neutral-500 outline-none"
            />
          </div>

          <BrandButton
            type="submit"
            size="icon"
            className="h-12 w-full shrink-0 px-0 shadow-[0_6px_24px_rgba(91,77,245,0.5)] sm:size-14"
            aria-label="Search jobs"
          >
            <Search className="size-[18px]" />
          </BrandButton>
        </form>

        {/* Trending Tags */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 sm:mt-6">
          <span className="text-[13px] text-neutral-500">
            Trending Position
          </span>
          {trendingTags.map((tag) => (
            <Link
              key={tag.label}
              href={tag.href}
              className="rounded-full border border-[#29293c] bg-[#14141f] px-3.5 py-1.5 text-[12px] font-medium text-neutral-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors hover:border-[#5b4df5]/60 hover:bg-[#1c1c2c] hover:text-white sm:text-[13px]"
            >
              {tag.label}
            </Link>
          ))}
        </div>

        {/* Globe & Stats Section */}
        <div className="relative mt-8 w-full sm:mt-2">
          {/* Globe Wrapper with Smooth Edge Blending */}
          <div className="relative mx-auto aspect-[4/3] w-full max-w-[1400px] overflow-hidden sm:aspect-[16/10]">
            <Image
              src={globeImg}
              alt="Globe network"
              priority
              className="absolute top-0 left-1/2 w-[112%] max-w-none -translate-x-1/2 -translate-y-[34%] object-contain mix-blend-screen"
            />

            {/* Soft edge fades so the globe blends into the page */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-[#08080a] via-[#08080a]/70 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-[#08080a] via-[#08080a]/60 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#08080a] to-transparent sm:w-32" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#08080a] to-transparent sm:w-32" />

            {/* Overlaid Headline on the Globe Curve */}
            <div className="absolute top-[43%] left-1/2 z-20 w-full max-w-[720px] -translate-x-1/2 px-4 text-center sm:top-[44%]">
              <h2 className="text-2xl leading-[1.3] font-bold tracking-tight text-white sm:text-3xl lg:text-[36px]">
                Assisting over 15,000 job seekers
                <br className="hidden sm:block" /> find their dream positions.
              </h2>
            </div>
          </div>

          {/* Stats 4-Card Grid Overlapping the Globe */}
          <div className="relative z-20 mx-auto -mt-14 grid w-full max-w-[1280px] grid-cols-1 gap-4 px-2 sm:-mt-[18%] sm:grid-cols-2 lg:-mt-[24%] lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="flex min-h-[176px] flex-col justify-between rounded-xl border border-white/[0.08] bg-[#0b0b0e]/90 p-6 pb-10 text-left shadow-[0_18px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-colors hover:border-white/20 hover:bg-[#111114]/95 lg:min-h-[250px] lg:pb-20"
                >
                  <Icon className="size-5 text-neutral-300" />
                  <div>
                    <div className="text-4xl font-bold tracking-tight text-white sm:text-[42px]">
                      {stat.value}
                    </div>
                    <div className="mt-1.5 text-[15px] text-neutral-400">
                      {stat.label}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
