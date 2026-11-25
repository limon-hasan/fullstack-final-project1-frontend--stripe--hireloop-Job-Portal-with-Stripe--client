import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  BadgeDollarSign,
  BarChart2,
  Bookmark,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock,
  Code2,
  Cpu,
  Globe,
  Laptop,
  MapPin,
  Monitor,
  PenTool,
  ShieldCheck,
  Umbrella,
} from "lucide-react"

import { getJobById } from "@/lib/api/jobs"
import { formatDate, formatSalary } from "@/lib/format"
import { ApplyJobButton } from "../components/ApplyJobButton"
import { JobActions } from "../components/JobActions"

interface JobDetailsPageProps {
  params: Promise<{ id: string }>
}

const toList = (value?: string | string[]): string[] => {
  if (!value) return []
  if (Array.isArray(value)) return value.filter(Boolean)
  return value
    .split("\n")
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean)
}

const DEFAULT_BENEFITS = [
  { label: "Full health & dental", icon: ShieldCheck },
  { label: "Competitive 401(k)", icon: BadgeDollarSign },
  { label: "Latest hardware stipend", icon: Laptop },
  { label: "Unlimited paid time off", icon: Umbrella },
]

const SKILL_ICONS = [Code2, Cpu, PenTool, Monitor]

const JobsDetailsPage = async ({ params }: JobDetailsPageProps) => {
  const { id } = await params
  const job = await getJobById(id)

  if (!job) {
    notFound()
  }

  const jobData = job as typeof job & {
    description?: string
    responsibilities?: string | string[]
    requirements?: string | string[]
    experience?: string
    experienceLevel?: string
    skills?: string[]
    benefits?: string[]
    companySize?: string
    industry?: string
    companyWebsite?: string
  }

  const responsibilities = toList(jobData.responsibilities)
  const requirements = toList(jobData.requirements)
  const skills = jobData.skills?.length ? jobData.skills : []
  const benefits = jobData.benefits?.length
    ? jobData.benefits.map((label, index) => ({
        label,
        icon: DEFAULT_BENEFITS[index % DEFAULT_BENEFITS.length].icon,
      }))
    : DEFAULT_BENEFITS

  const locationLabel = jobData.isRemote
    ? `${jobData.location || "Remote"} · Remote`
    : jobData.location || "On-site"

  const fallbackDescription = `At ${jobData.companyName}, we are looking for a skilled ${jobData.title} to join our ${jobData.category || "team"} on a ${jobData.jobType || "full-time"} basis (${locationLabel}). You will work closely with cross-functional teams to deliver high-impact solutions and help drive our core initiatives forward.`

  const overview = [
    {
      label: "Salary range",
      value: formatSalary(jobData.minSalary, jobData.maxSalary, jobData.frequency),
      icon: BadgeDollarSign,
    },
    { label: "Location", value: locationLabel, icon: MapPin },
    {
      label: "Job type",
      value: jobData.jobType || "Full-time",
      icon: Clock,
    },
    {
      label: "Experience",
      value: jobData.experience || jobData.experienceLevel || "2+ years",
      icon: BarChart2,
    },
    {
      label: "Category",
      value: jobData.category || "General",
      icon: Globe,
    },
    {
      label: "Deadline",
      value: jobData.deadline ? formatDate(jobData.deadline) : "Open until filled",
      icon: CalendarClock,
    },
  ]

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/browse-jobs"
            className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to browse jobs
          </Link>

          <span className="hidden items-center gap-1.5 text-[11px] text-zinc-500 sm:inline-flex">
            <Bookmark className="h-3.5 w-3.5" />
            Saved jobs sync to your dashboard
          </span>
        </div>

        <section className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d0e12] p-6 sm:p-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-[#5b4df5]/10 blur-3xl"
          />

          <div className="relative flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-[linear-gradient(135deg,#1d1e29,#121318)] text-lg font-semibold text-[#c7c1ff]">
                {jobData.companyName?.charAt(0).toUpperCase() || (
                  <Building2 className="h-6 w-6" />
                )}
              </div>

              <div className="space-y-2">
                <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  {jobData.title}
                </h1>

                <div className="flex flex-wrap items-center gap-2.5 text-[13px]">
                  <span className="font-medium text-zinc-300">
                    {jobData.companyName}
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Verified employer
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="inline-flex items-center gap-1.5 text-[12px] text-zinc-400">
                    <MapPin className="h-3.5 w-3.5" />
                    {locationLabel}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <span className="rounded-lg border border-white/[0.07] bg-[#14151b] px-2.5 py-1 text-[11px] font-medium text-zinc-300">
                    {jobData.jobType || "Full-time"}
                  </span>
                  <span className="rounded-lg border border-white/[0.07] bg-[#14151b] px-2.5 py-1 text-[11px] font-medium text-zinc-300">
                    {formatSalary(
                      jobData.minSalary,
                      jobData.maxSalary,
                      jobData.frequency
                    )}
                  </span>
                  {jobData.category && (
                    <span className="rounded-lg border border-[#5b4df5]/25 bg-[#5b4df5]/10 px-2.5 py-1 text-[11px] font-medium text-[#c7c1ff]">
                      {jobData.category}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <JobActions job={job} />
              <ApplyJobButton job={job} />
            </div>
          </div>
        </section>

        <div className="flex flex-col items-start gap-6 lg:flex-row">
          <div className="w-full min-w-0 flex-1 space-y-6">
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
              {overview.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/[0.07] bg-[#0d0e12] p-4"
                >
                  <Icon className="h-4 w-4 text-zinc-500" />
                  <p className="mt-3 text-[10px] font-semibold tracking-[0.12em] text-zinc-500 uppercase">
                    {label}
                  </p>
                  <p className="mt-1 text-[13px] font-medium text-white">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-8 rounded-2xl border border-white/[0.07] bg-[#0d0e12] p-6 sm:p-8">
              <section className="space-y-3">
                <h2 className="text-lg font-semibold text-white">
                  About the role
                </h2>
                <p className="text-[13.5px] leading-relaxed whitespace-pre-line text-zinc-400">
                  {jobData.description || fallbackDescription}
                </p>
              </section>

              {responsibilities.length > 0 && (
                <>
                  <div className="border-t border-white/[0.06]" />
                  <section className="space-y-3.5">
                    <h2 className="text-lg font-semibold text-white">
                      What you will do
                    </h2>
                    <ul className="space-y-2.5 text-[13.5px] leading-relaxed text-zinc-400">
                      {responsibilities.map((item, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6a5cff]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                </>
              )}

              {(skills.length > 0 || requirements.length > 0) && (
                <>
                  <div className="border-t border-white/[0.06]" />
                  <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-white">
                      What we are looking for
                    </h2>

                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => {
                          const Icon = SKILL_ICONS[index % SKILL_ICONS.length]
                          return (
                            <span
                              key={skill}
                              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-[#14151b] px-3 py-1.5 text-[11.5px] font-medium text-zinc-200"
                            >
                              <Icon className="h-3.5 w-3.5 text-zinc-500" />
                              {skill}
                            </span>
                          )
                        })}
                      </div>
                    )}

                    {requirements.length > 0 && (
                      <ul className="space-y-2.5 text-[13.5px] leading-relaxed text-zinc-400">
                        {requirements.map((item, index) => (
                          <li key={index} className="flex gap-3">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400/70" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                </>
              )}

              <div className="border-t border-white/[0.06]" />
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Benefits</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {benefits.map(({ label, icon: Icon }) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#111218] px-3.5 py-3"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-[#15161d] text-zinc-400">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-[12.5px] font-medium text-zinc-200">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <aside className="w-full shrink-0 lg:w-80 xl:w-96">
            <div className="space-y-4 lg:sticky lg:top-24">
              <div className="rounded-2xl border border-white/[0.07] bg-[#0d0e12] p-6">
                <h2 className="text-sm font-semibold text-white">
                  Company overview
                </h2>

                <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-xl border border-white/[0.07] bg-[linear-gradient(135deg,#1a1b26,#0d0e12)]">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-zinc-500">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-[#121318] text-zinc-300">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-medium text-zinc-400">
                      {jobData.companyName}
                    </span>
                  </div>
                </div>

                <div className="mt-4 divide-y divide-white/[0.06] text-[13px]">
                  <div className="flex items-center justify-between py-3">
                    <span className="text-[10px] font-semibold tracking-[0.12em] text-zinc-500 uppercase">
                      Size
                    </span>
                    <span className="font-medium text-zinc-200">
                      {jobData.companySize || "50 – 250 employees"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-3">
                    <span className="text-[10px] font-semibold tracking-[0.12em] text-zinc-500 uppercase">
                      Industry
                    </span>
                    <span className="text-right font-medium text-zinc-200">
                      {jobData.industry || jobData.category || "Technology"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-3">
                    <span className="text-[10px] font-semibold tracking-[0.12em] text-zinc-500 uppercase">
                      Listed
                    </span>
                    <span className="font-medium text-zinc-200">
                      {jobData.postedLabel || "Recently"}
                    </span>
                  </div>
                </div>

                {jobData.companyWebsite && (
                  <a
                    href={jobData.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex h-10 w-full items-center justify-center rounded-xl border border-white/[0.08] bg-[#14151b] text-[12.5px] font-medium text-zinc-200 transition-colors hover:border-white/20 hover:text-white"
                  >
                    Visit website
                  </a>
                )}
              </div>

              <div className="rounded-2xl border border-[#5b4df5]/25 bg-[linear-gradient(150deg,rgba(91,77,245,0.16),rgba(13,14,18,0.95)_65%)] p-5">
                <h2 className="text-sm font-semibold text-white">
                  Ready to apply?
                </h2>
                <p className="mt-1.5 text-[12px] leading-relaxed text-zinc-400">
                  One profile, one click. We will keep you updated at every
                  stage.
                </p>
                <div className="mt-4">
                  <ApplyJobButton job={job} />
                </div>
                <p className="mt-3 text-[10.5px] text-zinc-500">
                  By applying you agree to our terms and privacy policy.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default JobsDetailsPage
