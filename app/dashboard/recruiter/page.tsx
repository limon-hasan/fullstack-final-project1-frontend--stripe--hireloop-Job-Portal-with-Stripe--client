import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Building2,
  CalendarClock,
  CheckCircle2,
  Eye,
  FileText,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { BrandButton } from "@/components/shared/brand-button"
import { getApplications } from "@/lib/api/applications"
import { getJobs } from "@/lib/api/jobs"
import { getSession } from "@/lib/core/server"
import { formatRelativeTime, formatSalary } from "@/lib/format"
import type { ApplicationStatus } from "@/types/applications"

const STATUS_STYLES: Record<string, string> = {
  Applied: "border-zinc-700/80 bg-zinc-800/70 text-zinc-300",
  Pending: "border-zinc-700/80 bg-zinc-800/70 text-zinc-300",
  Review: "border-amber-500/25 bg-amber-500/10 text-amber-300",
  "Under Review": "border-amber-500/25 bg-amber-500/10 text-amber-300",
  Shortlisted: "border-sky-500/25 bg-sky-500/10 text-sky-300",
  Interview: "border-violet-500/25 bg-violet-500/10 text-violet-300",
  Offered: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
  Rejected: "border-rose-500/25 bg-rose-500/10 text-rose-300",
}

const POSITIVE_STATUSES: ApplicationStatus[] = [
  "Shortlisted",
  "Interview",
  "Offered",
]

function isRecent(dateValue: string) {
  if (!dateValue) return false
  const time = new Date(dateValue).getTime()
  if (Number.isNaN(time)) return false
  return Date.now() - time <= 7 * 24 * 60 * 60 * 1000
}

export default async function RecruiterDashboardPage() {
  const session = await getSession()
  const recruiterId = session?.user?.id ?? ""

  const [jobs, applications] = await Promise.all([
    getJobs(`recruiterId=${encodeURIComponent(recruiterId)}`),
    getApplications(),
  ])

  const jobIds = new Set(jobs.map((job) => job._id))
  const relevantApplications = applications.filter(
    (app) => !jobIds.size || jobIds.has(app.jobId)
  )

  const activeJobs = jobs.filter((job) => job.status === "Active").length
  const totalApplicants = jobs.reduce(
    (total, job) => total + (job.applicantsCount || 0),
    0
  )
  const newApplications = relevantApplications.filter((app) =>
    isRecent(app.appliedAt)
  ).length
  const positiveOutcomes = relevantApplications.filter((app) =>
    POSITIVE_STATUSES.includes(app.status)
  ).length
  const hireRate = relevantApplications.length
    ? Math.round((positiveOutcomes / relevantApplications.length) * 100)
    : 0

  const recentApplications = [...relevantApplications]
    .sort(
      (a, b) =>
        new Date(b.appliedAt ?? 0).getTime() -
        new Date(a.appliedAt ?? 0).getTime()
    )
    .slice(0, 5)

  const topJobs = [...jobs]
    .sort((a, b) => (b.applicantsCount || 0) - (a.applicantsCount || 0))
    .slice(0, 4)

  const maxApplicants = Math.max(1, ...topJobs.map((job) => job.applicantsCount))

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        breadcrumbs={[{ label: "Dashboard" }, { label: "Overview" }]}
        eyebrow="Recruiter workspace"
        title="Hiring overview"
        description="Track listing performance, monitor incoming applicants and keep your pipeline moving."
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/recruiter/jobs"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-[#101116] px-4 text-[13px] font-medium text-zinc-200 transition-colors hover:border-white/20 hover:text-white"
            >
              <Briefcase className="h-4 w-4 text-zinc-400" />
              Manage jobs
            </Link>
            <BrandButton
              nativeButton={false}
              render={<Link href="/dashboard/recruiter/jobs/new" />}
              className="h-10 px-4"
            >
              <Plus className="mr-2 h-4 w-4" />
              Post a job
            </BrandButton>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active jobs"
          value={activeJobs}
          icon={Briefcase}
          hint={`${jobs.length} total listings`}
          trend={
            jobs.length > 0
              ? { value: `${jobs.length - activeJobs} closed` }
              : undefined
          }
        />
        <StatCard
          label="Applicants"
          value={totalApplicants}
          icon={Users}
          accent="sky"
          hint="Across all listings"
        />
        <StatCard
          label="New this week"
          value={newApplications}
          icon={CalendarClock}
          accent="amber"
          hint="Last 7 days"
        />
        <StatCard
          label="Positive outcomes"
          value={`${hireRate}%`}
          icon={TrendingUp}
          accent="emerald"
          hint={`${positiveOutcomes} shortlisted or beyond`}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101116] xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-6 py-4">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Latest applicants
              </h2>
              <p className="mt-0.5 text-xs text-zinc-500">
                The newest people in your pipeline.
              </p>
            </div>
            <Link
              href="/dashboard/recruiter/applications"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#a99fff] transition-colors hover:text-white"
            >
              Review all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {recentApplications.length > 0 ? (
            <div className="divide-y divide-white/[0.05]">
              {recentApplications.map((app) => (
                <Link
                  key={app._id}
                  href={`/dashboard/recruiter/jobs/${app.jobId}/applications`}
                  className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/[0.02]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.07] bg-[#191a22] text-[11px] font-semibold text-zinc-200">
                    {(app.applicantName || app.applicantEmail || "A")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-white">
                      {app.applicantName || app.applicantEmail || "Applicant"}
                    </p>
                    <p className="mt-0.5 truncate text-[11.5px] text-zinc-500">
                      {app.jobTitle || "Role"} ·{" "}
                      {formatRelativeTime(app.appliedAt)}
                    </p>
                  </div>
                  <span
                    className={`hidden shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium sm:inline-flex ${
                      STATUS_STYLES[app.status] ?? STATUS_STYLES.Applied
                    }`}
                  >
                    {app.status}
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-600 transition-colors group-hover:text-white" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6">
              <EmptyState
                compact
                icon={FileText}
                title="No applicants yet"
                description="Publish a role and share the link — applications will flow in here."
                action={
                  <BrandButton
                    nativeButton={false}
                    render={<Link href="/dashboard/recruiter/jobs/new" />}
                  >
                    Post your first job
                  </BrandButton>
                }
              />
            </div>
          )}
        </section>

        <div className="space-y-5">
          <section className="rounded-2xl border border-white/[0.07] bg-[#101116] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">
                Listing performance
              </h2>
              <Eye className="h-4 w-4 text-zinc-600" />
            </div>

            {topJobs.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {topJobs.map((job) => (
                  <li key={job._id}>
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <Link
                        href={`/dashboard/recruiter/jobs/${job._id}`}
                        className="truncate text-[12.5px] font-medium text-zinc-300 transition-colors hover:text-white"
                      >
                        {job.title}
                      </Link>
                      <span className="shrink-0 text-[11px] font-medium text-zinc-400 tabular-nums">
                        {job.applicantsCount}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,#5b4df5,#8b81ff)]"
                        style={{
                          width: `${Math.max(
                            6,
                            Math.round((job.applicantsCount / maxApplicants) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-xs leading-relaxed text-zinc-500">
                Post a job to start tracking applicants per listing.
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-white/[0.07] bg-[#101116] p-5">
            <h2 className="text-sm font-semibold text-white">Company profile</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
              A complete profile helps candidates recognise your team before
              they apply.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Link
                href="/dashboard/recruiter/company"
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/[0.08] bg-[#15161d] px-3 text-[12px] font-medium text-zinc-200 transition-colors hover:border-white/20 hover:text-white"
              >
                <Building2 className="h-3.5 w-3.5" />
                Edit profile
              </Link>
              <Link
                href="/dashboard/recruiter/settings"
                className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-[12px] font-medium text-zinc-400 transition-colors hover:text-white"
              >
                Settings
              </Link>
            </div>
          </section>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101116]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-6 py-4">
          <div>
            <h2 className="text-sm font-semibold text-white">
              Your open roles
            </h2>
            <p className="mt-0.5 text-xs text-zinc-500">
              At-a-glance status for every listing you own.
            </p>
          </div>
          <Link
            href="/dashboard/recruiter/jobs"
            className="inline-flex items-center gap-1 text-xs font-medium text-[#a99fff] transition-colors hover:text-white"
          >
            Manage all jobs
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {jobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-white/[0.06] bg-[#15161d] text-[10px] font-semibold tracking-[0.12em] text-zinc-500 uppercase">
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-4 py-3.5">Type</th>
                  <th className="px-4 py-3.5">Salary</th>
                  <th className="px-4 py-3.5">Applicants</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Open</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-[13px]">
                {jobs.slice(0, 6).map((job) => (
                  <tr
                    key={job._id}
                    className="transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-3.5">
                      <p className="font-medium text-white">{job.title}</p>
                      <p className="mt-0.5 text-[11px] text-zinc-500">
                        {job.category}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-zinc-400">
                      {job.jobType}
                    </td>
                    <td className="px-4 py-3.5 text-zinc-300">
                      {formatSalary(job.minSalary, job.maxSalary, job.frequency)}
                    </td>
                    <td className="px-4 py-3.5 text-zinc-300 tabular-nums">
                      {job.applicantsCount}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                          job.status === "Active"
                            ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                            : "border-white/[0.08] bg-white/[0.04] text-zinc-400"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            job.status === "Active"
                              ? "bg-emerald-400"
                              : "bg-zinc-500"
                          }`}
                        />
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <Link
                        href={`/dashboard/recruiter/jobs/${job._id}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-[#15161d] text-zinc-400 transition-colors hover:border-white/20 hover:text-white"
                        aria-label={`Open ${job.title}`}
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <EmptyState
              compact
              icon={CheckCircle2}
              title="No listings yet"
              description="Create your first job post to start receiving applications."
              action={
                <BrandButton
                  nativeButton={false}
                  render={<Link href="/dashboard/recruiter/jobs/new" />}
                >
                  Create a listing
                </BrandButton>
              }
            />
          </div>
        )}
      </section>
    </div>
  )
}
