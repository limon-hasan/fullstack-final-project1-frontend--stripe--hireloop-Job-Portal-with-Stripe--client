import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  BadgeDollarSign,
  Banknote,
  BarChart2,
  Bookmark,
  Building2,
  CheckCircle2,
  Clock,
  Code2,
  Cpu,
  Laptop,
  MapPin,
  Monitor,
  PenTool,
  ShieldCheck,
  Umbrella,
} from "lucide-react"
import { getJobById } from "@/lib/api/jobs"
import { ApplyJobButton } from "../components/ApplyJobButton"

interface JobDetailsPageProps {
  params: Promise<{ id: string }>
}

const formatSalary = (min?: number, max?: number) => {
  if (!min && !max) return "Negotiable"
  const formatNum = (n: number) =>
    n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`

  if (min && max) return `${formatNum(min)} – ${formatNum(max)}`
  return formatNum(min || max || 0)
}

// Safely handles both string[] and newline-separated strings from MongoDB
const toList = (value?: string | string[]): string[] => {
  if (!value) return []
  if (Array.isArray(value)) return value.filter(Boolean)
  return value
    .split("\n")
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean)
}

const DEFAULT_BENEFITS = [
  { label: "Full Health & Dental", icon: ShieldCheck },
  { label: "Competitive 401k", icon: BadgeDollarSign },
  { label: "Latest Hardware Stipend", icon: Laptop },
  { label: "Unlimited PTO", icon: Umbrella },
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
    ? jobData.benefits.map((label, idx) => ({
        label,
        icon: DEFAULT_BENEFITS[idx % DEFAULT_BENEFITS.length].icon,
      }))
    : DEFAULT_BENEFITS

  const locationLabel = jobData.isRemote
    ? `${jobData.location || "Remote"} (Remote)`
    : jobData.location || "On-site"

  const fallbackDescription = `At ${jobData.companyName}, we are looking for a skilled ${jobData.title} to join our ${jobData.category || "team"} on a ${jobData.jobType || "full-time"} basis (${locationLabel}). You will work closely with cross-functional teams to deliver high-impact solutions and help drive our core initiatives forward.`

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Back Navigation */}
        <div>
          <Link
            href="/browse-jobs"
            className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Browse Jobs
          </Link>
        </div>

        {/* Top Job Header Card */}
        <section className="rounded-xl border border-zinc-800/80 bg-[#131417] p-6 sm:p-7">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4 sm:items-center">
              {/* Company Icon Box */}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-[#1A1C21] text-white">
                <Building2 className="h-6 w-6" />
              </div>

              <div className="space-y-1.5">
                <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  {jobData.title}
                </h1>

                <div className="flex flex-wrap items-center gap-2.5 text-sm">
                  <span className="font-medium text-zinc-300">
                    {jobData.companyName}
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Verified Employer
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 self-start sm:self-center">
              <button
                type="button"
                aria-label="Bookmark job"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-zinc-800 bg-[#1A1C21] text-zinc-300 transition-colors hover:border-zinc-700 hover:text-white"
              >
                <Bookmark className="h-4 w-4" />
              </button>

              <ApplyJobButton job={job} />
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="flex flex-col items-start gap-6 lg:flex-row">
          {/* Left Column (Highlights + Description Sections) */}
          <div className="w-full flex-1 space-y-6">
            {/* 4 Key Info Cards */}
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
              <div className="rounded-xl border border-zinc-800/80 bg-[#131417] p-4">
                <Banknote className="h-4 w-4 text-zinc-400" />
                <p className="mt-3 text-[11px] font-medium tracking-wider text-zinc-500 uppercase">
                  Salary Range
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {formatSalary(jobData.minSalary, jobData.maxSalary)}
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800/80 bg-[#131417] p-4">
                <MapPin className="h-4 w-4 text-zinc-400" />
                <p className="mt-3 text-[11px] font-medium tracking-wider text-zinc-500 uppercase">
                  Location
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {locationLabel}
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800/80 bg-[#131417] p-4">
                <Clock className="h-4 w-4 text-zinc-400" />
                <p className="mt-3 text-[11px] font-medium tracking-wider text-zinc-500 uppercase">
                  Job Type
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {jobData.jobType || "Full-time"}
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800/80 bg-[#131417] p-4">
                <BarChart2 className="h-4 w-4 text-zinc-400" />
                <p className="mt-3 text-[11px] font-medium tracking-wider text-zinc-500 uppercase">
                  Experience
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {jobData.experience || jobData.experienceLevel || "2+ Years"}
                </p>
              </div>
            </div>

            {/* Detailed Job Sections Card */}
            <div className="space-y-8 rounded-xl border border-zinc-800/80 bg-[#131417] p-6 sm:p-8">
              {/* Job Description */}
              <section className="space-y-3">
                <h2 className="text-lg font-semibold text-white">
                  Job Description
                </h2>
                <p className="text-sm leading-relaxed whitespace-pre-line text-zinc-400">
                  {jobData.description || fallbackDescription}
                </p>
              </section>

              {/* Responsibilities */}
              {responsibilities.length > 0 && (
                <>
                  <div className="border-t border-zinc-800/80" />
                  <section className="space-y-3.5">
                    <h2 className="text-lg font-semibold text-white">
                      Responsibilities
                    </h2>
                    <ul className="list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-zinc-400 marker:text-zinc-500">
                      {responsibilities.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </section>
                </>
              )}

              {/* Requirements */}
              {(skills.length > 0 || requirements.length > 0) && (
                <>
                  <div className="border-t border-zinc-800/80" />
                  <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-white">
                      Requirements
                    </h2>

                    {/* Optional Skill Pills */}
                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-2.5">
                        {skills.map((skill, index) => {
                          const Icon = SKILL_ICONS[index % SKILL_ICONS.length]
                          return (
                            <span
                              key={skill}
                              className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-[#1A1C21] px-3 py-1.5 text-xs font-medium text-zinc-200"
                            >
                              <Icon className="h-3.5 w-3.5 text-zinc-400" />
                              {skill}
                            </span>
                          )
                        })}
                      </div>
                    )}

                    {requirements.length > 0 && (
                      <ul className="list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-zinc-400 marker:text-zinc-500">
                        {requirements.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </section>
                </>
              )}

              {/* Benefits */}
              <div className="border-t border-zinc-800/80" />
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Benefits</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {benefits.map(({ label, icon: Icon }) => (
                    <div key={label} className="flex items-center gap-3.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-[#1A1C21] text-zinc-300">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium text-zinc-200">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Right Column (Company Overview Sidebar) */}
          <aside className="w-full shrink-0 lg:w-80 xl:w-96">
            <div className="space-y-5 rounded-xl border border-zinc-800/80 bg-[#131417] p-6">
              <h2 className="text-lg font-semibold text-white">
                Company Overview
              </h2>

              {/* Company Office Preview Banner */}
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-zinc-800 bg-gradient-to-br from-[#1A1C21] via-[#13171D] to-[#0D1117]">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-zinc-500">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-[#131417]/90 text-zinc-300">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-zinc-400">
                    {jobData.companyName}
                  </span>
                </div>
              </div>

              {/* Company Metadata */}
              <div className="divide-y divide-zinc-800/80 text-sm">
                <div className="flex items-center justify-between py-3">
                  <span className="text-xs font-medium tracking-wider text-zinc-500 uppercase">
                    Size
                  </span>
                  <span className="font-medium text-zinc-200">
                    {jobData.companySize || "50 – 250 Employees"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 py-3">
                  <span className="text-xs font-medium tracking-wider text-zinc-500 uppercase">
                    Industry
                  </span>
                  <span className="text-right font-medium text-zinc-200">
                    {jobData.industry || jobData.category || "Technology"}
                  </span>
                </div>
              </div>

              {/* Visit Website Button */}
              <a
                href={jobData.companyWebsite || "#"}
                target={jobData.companyWebsite ? "_blank" : undefined}
                rel={jobData.companyWebsite ? "noopener noreferrer" : undefined}
                className="block w-full rounded-lg border border-zinc-800 bg-[#1A1C21] py-2.5 text-center text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-700 hover:text-white"
              >
                Visit Website
              </a>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default JobsDetailsPage
