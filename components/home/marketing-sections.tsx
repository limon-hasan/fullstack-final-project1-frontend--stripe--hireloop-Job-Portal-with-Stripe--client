import Link from "next/link"
import { ArrowRight, Check, Sparkles } from "lucide-react"

import { JobCard } from "@/app/browse-jobs/components/JobCard"
import { BrandButton } from "@/components/shared/brand-button"
import {
  CANDIDATE_BENEFITS,
  HOW_IT_WORKS,
  JOB_CATEGORY_SHOWCASE,
  RECRUITER_BENEFITS,
  TESTIMONIALS,
  TRUSTED_BY,
} from "@/lib/constants/marketing"
import type { ManagedJob } from "@/types/jobs"

export function TrustedBy() {
  return (
    <section className="border-y border-white/[0.05] bg-[#0a0a0d] py-8">
      <div className="mx-auto flex max-w-[1240px] flex-col items-center gap-5 px-4 sm:px-6 lg:flex-row lg:justify-between">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-zinc-500 uppercase">
          Trusted by hiring teams at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {TRUSTED_BY.map((company) => (
            <span
              key={company}
              className="text-sm font-semibold tracking-tight text-zinc-500 transition-colors hover:text-zinc-300"
            >
              {company}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FeaturedJobs({ jobs }: { jobs: ManagedJob[] }) {
  return (
    <section className="mx-auto w-full max-w-[1240px] px-4 pt-20 sm:px-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-[#8b81ff] uppercase">
            Fresh openings
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Roles worth a closer look
          </h2>
          <p className="mt-2 max-w-xl text-sm text-zinc-400">
            A live snapshot of recently posted positions across our network.
          </p>
        </div>
        <Link
          href="/browse-jobs"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
        >
          View all roles
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {jobs.length > 0 ? (
        <div className="mt-7 grid gap-3.5 md:grid-cols-2">
          {jobs.slice(0, 6).map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      ) : (
        <div className="mt-7 flex flex-col items-start justify-between gap-5 rounded-2xl border border-white/[0.07] bg-[#0d0e12] p-6 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-base font-semibold text-white">
              The live board is warming up
            </h3>
            <p className="mt-1 max-w-lg text-sm text-zinc-400">
              New roles are added throughout the day. Explore the full board or
              set up a profile so hiring teams can find you first.
            </p>
          </div>
          <BrandButton
            nativeButton={false}
            render={<Link href="/browse-jobs" />}
            className="shrink-0"
          >
            Explore the board
            <ArrowRight className="ml-2 h-4 w-4" />
          </BrandButton>
        </div>
      )}
    </section>
  )
}

export function CategoryShowcase({ jobs = [] }: { jobs?: ManagedJob[] }) {
  return (
    <section className="mx-auto w-full max-w-[1240px] px-4 pt-20 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-[#8b81ff] uppercase">
          Explore by discipline
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Find the work that fits you
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Jump straight into open roles across each discipline and discover
          teams actively hiring right now.
        </p>
      </div>

      <div className="mt-7 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {JOB_CATEGORY_SHOWCASE.map(({ name, description, icon: Icon, accent }) => {
          const isRemoteTrack = name === "Remote & Global"
          const matchingJobs = isRemoteTrack
            ? jobs.filter((job) => job.isRemote)
            : jobs.filter((job) => job.category === name)
          const href = isRemoteTrack
            ? "/browse-jobs?isRemote=true"
            : `/browse-jobs?category=${encodeURIComponent(name)}`
          const sampleTitles = matchingJobs
            .slice(0, 2)
            .map((job) => job.title)
            .filter(Boolean)

          return (
            <Link
              key={name}
              href={href}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d0e12] p-5 transition-all hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-[#101116]"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border ${accent}`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="rounded-full border border-white/[0.07] bg-[#14151b] px-2.5 py-1 text-[11px] font-medium text-zinc-400">
                    {matchingJobs.length > 0
                      ? `${matchingJobs.length} ${matchingJobs.length === 1 ? "open role" : "open roles"}`
                      : "Explore roles"}
                  </span>
                </div>
                <h3 className="mt-4 text-[15px] font-semibold text-white">
                  {name}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500">
                  {description}
                </p>
                {sampleTitles.length > 0 ? (
                  <p className="mt-3 truncate text-[11.5px] font-medium text-zinc-400">
                    e.g. {sampleTitles.join(" · ")}
                  </p>
                ) : null}
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-[#a99fff] transition-colors group-hover:text-white">
                {matchingJobs.length > 0
                  ? `View ${matchingJobs.length} ${matchingJobs.length === 1 ? "role" : "roles"}`
                  : "Browse roles"}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export function HowItWorks() {
  return (
    <section className="mx-auto w-full max-w-[1240px] px-4 pt-20 sm:px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10 dark:border-white/[0.07] dark:bg-[linear-gradient(180deg,#0c0d12_0%,#08080a_100%)] dark:shadow-none">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-[#8b81ff] uppercase">
            How HireLoop works
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Three steps, zero busywork
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            A focused workflow for candidates and a clear pipeline for hiring
            teams.
          </p>
        </div>

        <div className="mt-8 grid gap-3.5 md:grid-cols-3">
          {HOW_IT_WORKS.map(({ icon: Icon, title, description }, index) => (
            <div
              key={title}
              className="relative rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 dark:border-white/[0.06] dark:bg-[#0e0f14]"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#5b4df5]/25 bg-[#5b4df5]/10 text-[#a99fff]">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <span className="font-mono text-xs text-zinc-600">
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-4 text-[15px] font-semibold text-white">
                {title}
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function BenefitsSplit() {
  const groups = [
    {
      title: "For candidates",
      description:
        "Everything you need to go from first look to signed offer.",
      benefits: CANDIDATE_BENEFITS,
      href: "/signup",
      cta: "Create a free profile",
    },
    {
      title: "For hiring teams",
      description:
        "Publish roles, review applicants and move candidates forward.",
      benefits: RECRUITER_BENEFITS,
      href: "/dashboard/recruiter/jobs/new",
      cta: "Post your first role",
    },
  ]

  return (
    <section className="mx-auto w-full max-w-[1240px] px-4 pt-20 sm:px-6">
      <div className="grid gap-4 lg:grid-cols-2">
        {groups.map((group, index) => (
          <div
            key={group.title}
            className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 ${index === 0
              ? "border-[#5b4df5]/25 bg-[linear-gradient(145deg,rgba(91,77,245,0.08),rgba(255,255,255,0.98)_55%)] shadow-sm dark:border-[#5b4df5]/20 dark:bg-[linear-gradient(145deg,rgba(91,77,245,0.14),rgba(12,13,18,0.9)_55%)] dark:shadow-none"
              : "border-white/[0.07] bg-[#0d0e12]"
              }`}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-20 -right-16 h-52 w-52 rounded-full bg-[#5b4df5]/10 blur-3xl"
            />
            <h2 className="text-xl font-semibold tracking-tight text-white">
              {group.title}
            </h2>
            <p className="mt-2 max-w-md text-sm text-zinc-400">
              {group.description}
            </p>

            <ul className="mt-6 space-y-3">
              {group.benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-2.5 text-sm text-zinc-300"
                >
                  <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border border-emerald-500/25 bg-emerald-500/10 text-emerald-300">
                    <Check className="h-3 w-3" />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>

            <Link
              href={group.href}
              className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-[#b7afff] transition-colors hover:text-white"
            >
              {group.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

export function Testimonials() {
  return (
    <section className="mx-auto w-full max-w-[1240px] px-4 pt-20 sm:px-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-[#8b81ff] uppercase">
            Voices from the network
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            People who found their fit
          </h2>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1.5 text-[11px] font-medium text-amber-300">
          <Sparkles className="h-3 w-3" />
          4.9 average rating
        </span>
      </div>

      <div className="mt-7 grid gap-3.5 md:grid-cols-3">
        {TESTIMONIALS.map((testimonial) => (
          <figure
            key={testimonial.name}
            className="flex h-full flex-col justify-between rounded-2xl border border-white/[0.07] bg-[#0d0e12] p-5"
          >
            <blockquote className="text-[13.5px] leading-relaxed text-zinc-300">
              “{testimonial.quote}”
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-white/[0.06] pt-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-[#191a22] text-[11px] font-semibold text-zinc-300">
                {testimonial.initials}
              </span>
              <div>
                <p className="text-[13px] font-semibold text-white">
                  {testimonial.name}
                </p>
                <p className="text-[11px] text-zinc-500">
                  {testimonial.role} · {testimonial.company}
                </p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

export function CtaBand() {
  return (
    <section className="mx-auto w-full max-w-[1240px] px-4 pt-20 sm:px-6">
      <div className="keep-dark relative overflow-hidden rounded-3xl border border-[#5b4df5]/25 bg-[linear-gradient(120deg,#121020_0%,#16142a_45%,#0b0c12_100%)] px-6 py-10 text-center shadow-xl shadow-indigo-950/10 sm:px-10 sm:py-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -top-24 left-1/2 h-64 w-[620px] -translate-x-1/2 rounded-full bg-[#5b4df5]/25 blur-[110px]" />
          <div
            className="absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
        </div>

        <div className="relative">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-[#b7afff] uppercase">
            Your next chapter
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
            Ready to make your next move count?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
            Join a network built for clarity. Free to start, no spam, and you
            can leave whenever you like.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <BrandButton
              nativeButton={false}
              render={<Link href="/signup" />}
              className="w-full sm:w-auto"
            >
              Get started free
              <ArrowRight className="ml-2 h-4 w-4" />
            </BrandButton>
            <Link
              href="/pricing"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.03] px-6 text-sm font-medium text-zinc-200 transition-colors hover:border-white/25 hover:text-white sm:w-auto"
            >
              Compare plans
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
