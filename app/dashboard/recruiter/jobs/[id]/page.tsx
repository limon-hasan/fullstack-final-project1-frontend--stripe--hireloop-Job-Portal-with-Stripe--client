import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  CalendarClock,
  CircleDollarSign,
  Clock,
  FileText,
  Globe,
  MapPin,
  Pencil,
  Tag,
  Users,
} from "lucide-react"

import { DeleteJobDialog } from "@/components/dashboard/DeleteJobDialog"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { getApplications } from "@/lib/api/applications"
import { getJobById } from "@/lib/api/jobs"
import {
  formatDate,
  formatRelativeTime,
  formatSalary,
} from "@/lib/format"

export const metadata: Metadata = {
  title: "Job details",
}

interface JobDetailPageProps {
  params: Promise<{ id: string }>
}

const STATUS_STYLES: Record<string, string> = {
  Applied: "border-zinc-700/80 bg-zinc-800/70 text-zinc-300",
  Pending: "border-zinc-700/80 bg-zinc-800/70 text-zinc-300",
  Review: "border-amber-500/25 bg-amber-500/10 text-amber-300",
  "Under Review": "border-sky-500/25 bg-sky-500/10 text-sky-300",
  Shortlisted: "border-indigo-500/25 bg-indigo-500/10 text-indigo-300",
  Interview: "border-violet-500/25 bg-violet-500/10 text-violet-300",
  Offered: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
  Rejected: "border-rose-500/25 bg-rose-500/10 text-rose-300",
}

function getDaysLeft(deadline: string) {
  if (!deadline) return null
  const date = new Date(deadline)
  if (Number.isNaN(date.getTime())) return null
  return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params
  const job = await getJobById(id)

  if (!job) notFound()

  const applications = await getApplications(
    `jobId=${encodeURIComponent(job._id)}`
  )

  const daysLeft = getDaysLeft(job.deadline)
  const isActive = job.status === "Active"
  const jobLink = `/browse-jobs/${job._id}`

  const statusCounts = [
    "Applied",
    "Under Review",
    "Shortlisted",
    "Interview",
    "Offered",
    "Rejected",
  ].map((status) => ({
    status,
    count: applications.filter(
      (app) =>
        app.status === status ||
        (status === "Applied" && app.status === "Pending") ||
        (status === "Under Review" && app.status === "Review")
    ).length,
  }))

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        breadcrumbs={[
          { label: "Manage jobs", href: "/dashboard/recruiter/jobs" },
          { label: job.title },
        ]}
        title={job.title}
        description={`${job.companyName} · ${job.isRemote ? "Remote" : job.location}`}
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/recruiter/jobs"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-[#101116] px-4 text-[13px] font-medium text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <Link
              href={jobLink}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-[#101116] px-4 text-[13px] font-medium text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
            >
              <ArrowUpRight className="h-4 w-4" />
              Public view
            </Link>
            <Link
              href={`/dashboard/recruiter/jobs/${job._id}/edit`}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#5b4df5] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#6a5cff]"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Applicants"
          value={job.applicantsCount || applications.length}
          icon={Users}
          hint="Total candidates"
        />
        <StatCard
          label="Status"
          value={isActive ? "Active" : "Expired"}
          icon={Clock}
          accent={isActive ? "emerald" : "rose"}
          hint={isActive ? "Visible on job board" : "No longer accepting"}
        />
        <StatCard
          label="Days left"
          value={daysLeft === null ? "—" : Math.max(0, daysLeft)}
          icon={CalendarClock}
          accent="amber"
          hint={formatDate(job.deadline)}
        />
        <StatCard
          label="Compensation"
          value={formatSalary(job.minSalary, job.maxSalary, job.frequency)}
          icon={CircleDollarSign}
          accent="sky"
          hint={job.frequency}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101116]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-[#15161d] text-zinc-400">
                  <FileText className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Role description
                  </h2>
                  <p className="text-[11px] text-zinc-500">
                    This is what candidates read before applying.
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                  isActive
                    ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                    : "border-white/[0.08] bg-white/[0.04] text-zinc-400"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isActive ? "bg-emerald-400" : "bg-zinc-500"
                  }`}
                />
                {job.status}
              </span>
            </div>

            <div className="space-y-6 px-6 py-5">
              <div>
                <h3 className="text-[11px] font-semibold tracking-[0.14em] text-zinc-500 uppercase">
                  Responsibilities
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed whitespace-pre-line text-zinc-300">
                  {job.responsibilities || "No responsibilities provided."}
                </p>
              </div>

              <div className="border-t border-white/[0.06] pt-5">
                <h3 className="text-[11px] font-semibold tracking-[0.14em] text-zinc-500 uppercase">
                  Requirements
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed whitespace-pre-line text-zinc-300">
                  {job.requirements || "No requirements provided."}
                </p>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101116]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-6 py-4">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Applicant pipeline
                </h2>
                <p className="mt-0.5 text-[11px] text-zinc-500">
                  Where candidates sit right now.
                </p>
              </div>
              <Link
                href={`/dashboard/recruiter/jobs/${job._id}/applications`}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#a99fff] transition-colors hover:text-white"
              >
                Review applications
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {applications.length > 0 ? (
              <div className="grid grid-cols-2 gap-px bg-white/[0.05] sm:grid-cols-3">
                {statusCounts.map((item) => (
                  <div key={item.status} className="bg-[#101116] px-5 py-4">
                    <p className="text-[11px] text-zinc-500">{item.status}</p>
                    <p className="mt-1 text-xl font-semibold text-white tabular-nums">
                      {item.count}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6">
                <EmptyState
                  compact
                  icon={Users}
                  title="No applications yet"
                  description="Share the public listing link to start attracting candidates."
                />
              </div>
            )}
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-2xl border border-white/[0.07] bg-[#101116] p-5">
            <h2 className="text-sm font-semibold text-white">Listing details</h2>
            <dl className="mt-4 space-y-3.5 text-[12.5px]">
              {[
                {
                  label: "Company",
                  value: job.companyName || "—",
                  icon: Building2,
                },
                {
                  label: "Category",
                  value: job.category || "—",
                  icon: Tag,
                },
                {
                  label: "Employment type",
                  value: job.jobType || "—",
                  icon: Clock,
                },
                {
                  label: "Location",
                  value: job.isRemote
                    ? `Remote · ${job.location || "Worldwide"}`
                    : job.location || "—",
                  icon: job.isRemote ? Globe : MapPin,
                },
                {
                  label: "Deadline",
                  value: formatDate(job.deadline),
                  icon: CalendarClock,
                },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/[0.06] bg-[#15161d] text-zinc-500">
                      <Icon className="h-3 w-3" />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-[10.5px] tracking-wide text-zinc-500 uppercase">
                        {item.label}
                      </dt>
                      <dd className="mt-0.5 truncate font-medium text-zinc-200">
                        {item.value}
                      </dd>
                    </div>
                  </div>
                )
              })}
            </dl>

            {job.postedLabel && (
              <p className="mt-4 border-t border-white/[0.06] pt-3.5 text-[11px] text-zinc-500">
                Posted {formatRelativeTime(job.postedLabel)}
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-rose-500/15 bg-rose-500/[0.04] p-5">
            <h2 className="text-sm font-semibold text-white">Danger zone</h2>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-zinc-500">
              Deleting a listing is permanent. Applications already submitted
              will no longer be reachable from this job.
            </p>
            <div className="mt-4">
              <DeleteJobDialog job={job} />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
