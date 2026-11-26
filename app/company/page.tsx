import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Globe2, Sparkles } from "lucide-react"

import { BrandButton } from "@/components/shared/brand-button"
import {
  COMPANY_MILESTONES,
  COMPANY_TEAM,
  COMPANY_VALUES,
} from "@/lib/constants/marketing"

export const metadata: Metadata = {
  title: "Company",
  description:
    "HireLoop is building a calmer, more transparent hiring network for candidates and teams.",
}

export default function CompanyPage() {
  return (
    <main className="overflow-hidden bg-[#08080a]">
      <section className="relative isolate px-4 pt-20 pb-16 sm:px-6 sm:pt-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute top-0 left-1/2 h-[460px] w-[900px] -translate-x-1/2 rounded-full bg-[#5b4df5]/16 blur-[140px]" />
        </div>

        <div className="mx-auto max-w-[1000px] text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#101116] px-3.5 py-1.5 text-[11px] font-medium text-zinc-300">
            <Globe2 className="h-3.5 w-3.5 text-[#a99fff]" />
            Remote-first · 48 countries
          </span>

          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.03em] text-balance text-white sm:text-5xl lg:text-[56px]">
            Hiring should feel
            <span className="bg-[linear-gradient(100deg,#1e1b4b_10%,#5b4df5_52%,#7c3aed_92%)] bg-clip-text text-transparent dark:bg-[linear-gradient(100deg,#ffffff_10%,#cfcaff_55%,#8b81ff_95%)]">
              {" "}
              human again
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-pretty text-zinc-400 sm:text-base">
            We started HireLoop because job hunting had become a numbers game
            and hiring had become an inbox. We are building the opposite:
            curated roles, transparent pay and tools that respect everyone&apos;s
            time.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <BrandButton
              nativeButton={false}
              render={<Link href="/browse-jobs" />}
            >
              Explore open roles
              <ArrowRight className="ml-2 h-4 w-4" />
            </BrandButton>
            <Link
              href="/pricing"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.03] px-6 text-sm font-medium text-zinc-200 transition-colors hover:border-white/25 hover:text-white"
            >
              See our plans
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
          {COMPANY_MILESTONES.map((milestone) => (
            <div
              key={milestone.label}
              className="rounded-2xl border border-white/[0.07] bg-[#0d0e12] px-4 py-5 text-center"
            >
              <p className="text-2xl font-semibold tracking-tight text-white">
                {milestone.value}
              </p>
              <p className="mt-1 text-[11px] text-zinc-500">
                {milestone.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-4 py-16 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-[#8b81ff] uppercase">
            What we believe
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Principles we build against
          </h2>
        </div>

        <div className="mt-7 grid gap-3.5 sm:grid-cols-2">
          {COMPANY_VALUES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/[0.07] bg-[#0d0e12] p-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#5b4df5]/25 bg-[#5b4df5]/10 text-[#a99fff]">
                <Icon className="h-4.5 w-4.5" />
              </span>
              <h3 className="mt-4 text-[15px] font-semibold text-white">
                {title}
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-4 pb-20 sm:px-6">
        <div className="rounded-3xl border border-white/[0.07] bg-[#0c0d12] p-6 sm:p-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-[#8b81ff] uppercase">
                The team
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                Small team, long horizon
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
              <Sparkles className="h-3.5 w-3.5 text-[#a99fff]" />
              We are hiring across product and engineering
            </span>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {COMPANY_TEAM.map((member) => (
              <div
                key={member.name}
                className="rounded-2xl border border-white/[0.06] bg-[#101116] p-4 text-center"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-[linear-gradient(135deg,#23203f,#14151b)] text-sm font-semibold text-[#c7c1ff]">
                  {member.initials}
                </div>
                <p className="mt-3 text-sm font-semibold text-white">
                  {member.name}
                </p>
                <p className="mt-0.5 text-[11px] text-zinc-500">
                  {member.role}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#5b4df5]/20 bg-[#5b4df5]/[0.06] p-5 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-sm font-semibold text-white">
                Want to build with us?
              </h3>
              <p className="mt-1 text-xs text-zinc-400">
                Browse open roles on the HireLoop board and apply directly.
              </p>
            </div>
            <BrandButton
              nativeButton={false}
              render={<Link href="/browse-jobs" />}
              className="shrink-0"
            >
              View openings
            </BrandButton>
          </div>
        </div>
      </section>
    </main>
  )
}
