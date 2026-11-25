import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  Compass,
  FileText,
  MapPin,
  Sparkles,
  TrendingUp,
} from "lucide-react"

import { BrandButton } from "@/components/shared/brand-button"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { getApplications } from "@/lib/api/applications"
import { getJobs } from "@/lib/api/jobs"
import { getSession } from "@/lib/core/server"
import { formatRelativeTime, formatSalary } from "@/lib/format"
import type { ApplicationStatus } from "@/types/applications"

const ACTIVE_STATUSES: ApplicationStatus[] = [
  "Applied",
  "Pending",
  "Review",
  "Under Review",
  "Interview",
]

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

const STATUS_BAR: Record<string, string> = {
  Applied: "bg-zinc-400",
  Pending: "bg-zinc-400",
  Review: "bg-amber-400",
  "Under Review": "bg-amber-400",
  Shortlisted: "bg-sky-400",
  Interview: "bg-violet-400",
  Offered: "bg-emerald-400",
  Rejected: "bg-rose-400",
}

export default async function SeekerDashboardPage() {
  const session = await getSession()
  const userId = session?.user?.id ?? ""

  const [applications, jobs] = await Promise.all([
    userId ? getApplications(`userId=${encodeURIComponent(userId)}`) : [],
    getJobs(),
  ])

  const activeApplications = applications.filter((app) => !app.archived)
  const interviews = applications.filter((app) =>
    ["Interview", "Review", "Under Review"].includes(app.status)
  ).length
  const offers = applications.filter((app) => app.status === "Offered").length
  const shortlisted = applications.filter(
    (app) => app.status === "Shortlisted"
  ).length
  const responseRate =
    applications.length > 0
      ? Math.round(((applications.length - activeApplications.filter((a) => a.status === "Applied" || a.status === "Pending").length) / applications.length) * 100)
      : 0

  const recentApplications = [...applications]
    .sort((a, b) => {
      const aTime = new Date(a.appliedAt ?? 0).getTime()
      const bTime = new Date(b.appliedAt ?? 0).getTime()
      return bTime - aTime
    })
    .slice(0, 4)

  const recommendedJobs = jobs.slice(0, 3)
  const firstName = session?.user?.name?.split(" ")[0] || "there"

  const pipeline = ACTIVE_STATUSES.map((status) => ({
    status,
    count: applications.filter((app) => app.status === status).length,
  }))

  const checklist = [
    {
      label: "Add your full name",
      done: Boolean(session?.user?.name),
      href: "/dashboard/seeker/settings",
    },
    {
      label: "Verify your email address",
      done: Boolean(session?.user?.emailVerified),
      href: "/dashboard/seeker/settings",
    },
    {
      label: "Save at least one job",
      done: false,
      href: "/dashboard/seeker/saved-jobs",
    },
    {
      label: "Submit your first application",
      done: applications.length > 0,
      href: "/browse-jobs",
    },
  ]
  const completedSteps = checklist.filter((item) => item.done).length

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        breadcrumbs={[{ label: "Dashboard" }, { label: "Overview" }]}
        eyebrow="Seeker workspace"
        title={`Welcome back, ${firstName}`}
        description="Here is a snapshot of your job search — applications, interviews and fresh roles picked for you."
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/seeker/applications"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-[#101116] px-4 text-[13px] font-medium text-zinc-200 transition-colors hover:border-white/20 hover:text-white"
            >
              <FileText className="h-4 w-4 text-zinc-400" />
              Applications
            </Link>
            <BrandButton
              nativeButton={false}
              render={<Link href="/browse-jobs" />}
              className="h-10 px-4"
            >
              <Compass className="mr-2 h-4 w-4" />
              Find jobs
            </BrandButton>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Applications"
          value={applications.length}
          icon={FileText}
          hint="Total submitted"
          trend={
            applications.length > 0
              ? { value: `${activeApplications.length} active` }
              : undefined
          }
        />
        <StatCard
          label="Shortlisted"
          value={shortlisted}
          icon={CheckCircle2}
          accent="sky"
          hint="Recruiters interested"
        />
        <StatCard
          label="Interviews"
          value={interviews}
          icon={CalendarClock}
          accent="violet"
          hint="In review or scheduled"
        />
        <StatCard
          label="Response rate"
          value={`${Math.max(0, Math.min(100, responseRate))}%`}
          icon={TrendingUp}
          accent="emerald"
          hint={`${offers} offer${offers === 1 ? "" : "s"} received`}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101116] xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-6 py-4">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Recent applications
              </h2>
              <p className="mt-0.5 text-xs text-zinc-500">
                Your latest submissions and their current stage.
              </p>
            </div>
            <Link
              href="/dashboard/seeker/applications"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#a99fff] transition-colors hover:text-white"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {recentApplications.length > 0 ? (
            <div className="divide-y divide-white/[0.05]">
              {recentApplications.map((app) => (
                <Link
                  key={app._id}
                  href={
                    app.jobId
                      ? `/browse-jobs/${app.jobId}`
                      : "/dashboard/seeker/applications"
                  }
                  className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/[0.02]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-[#15161d] text-sm font-semibold text-[#b7afff]">
                    {(app.companyName || "C").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-semibold text-white">
                      {app.jobTitle || "Untitled role"}
                    </p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[11.5px] text-zinc-500">
                      <span className="text-zinc-400">
                        {app.companyName || "Company"}
                      </span>
                      <span className="text-zinc-700">•</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {app.isRemote ? "Remote" : app.location || "—"}
                      </span>
                      <span className="text-zinc-700">•</span>
                      <span>{formatRelativeTime(app.appliedAt)}</span>
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
                icon={FileText}
                title="No applications yet"
                description="When you apply to a role it will appear here with live status updates from the recruiter."
                action={
                  <BrandButton
                    nativeButton={false}
                    render={<Link href="/browse-jobs" />}
                  >
                    Explore open roles
                  </BrandButton>
                }
              />
            </div>
          )}
        </section>

        <div className="space-y-5">
          <section className="rounded-2xl border border-white/[0.07] bg-[#101116] p-5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#5b4df5]/25 bg-[#5b4df5]/10 text-[#a99fff]">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Profile strength
                </h2>
                <p className="text-[11px] text-zinc-500">
                  {completedSteps} of {checklist.length} steps complete
                </p>
              </div>
            </div>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#5b4df5,#8b81ff)] transition-all"
                style={{
                  width: `${Math.round((completedSteps / checklist.length) * 100)}%`,
                }}
              />
            </div>

            <ul className="mt-4 space-y-2.5">
              {checklist.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2.5 text-[12.5px] transition-colors hover:text-white"
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                        item.done
                          ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                          : "border-white/[0.12] bg-[#15161d] text-transparent"
                      }`}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                    </span>
                    <span
                      className={
                        item.done
                          ? "text-zinc-500 line-through"
                          : "text-zinc-300"
                      }
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-white/[0.07] bg-[#101116] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">
                Application pipeline
              </h2>
              <Bookmark className="h-4 w-4 text-zinc-600" />
            </div>

            {applications.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {pipeline.map((item) => {
                  const percent = applications.length
                    ? Math.round((item.count / applications.length) * 100)
                    : 0
                  return (
                    <li key={item.status}>
                      <div className="mb-1 flex items-center justify-between text-[11.5px]">
                        <span className="text-zinc-400">{item.status}</span>
                        <span className="font-medium text-zinc-300 tabular-nums">
                          {item.count}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                        <div
                          className={`h-full rounded-full ${STATUS_BAR[item.status] ?? "bg-zinc-500"}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="mt-3 text-xs leading-relaxed text-zinc-500">
                Your pipeline will populate as soon as you apply to your first
                role.
              </p>
            )}
          </section>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101116]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-6 py-4">
          <div>
            <h2 className="text-sm font-semibold text-white">
              Picked for you
            </h2>
            <p className="mt-0.5 text-xs text-zinc-500">
              Fresh roles from teams hiring right now.
            </p>
          </div>
          <Link
            href="/browse-jobs"
            className="inline-flex items-center gap-1 text-xs font-medium text-[#a99fff] transition-colors hover:text-white"
          >
            Browse everything
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recommendedJobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-px bg-white/[0.05] md:grid-cols-3">
            {recommendedJobs.map((job) => (
              <Link
                key={job._id}
                href={`/browse-jobs/${job._id}`}
                className="group flex flex-col gap-3 bg-[#101116] p-5 transition-colors hover:bg-[#14151b]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-[#15161d] text-sm font-semibold text-[#b7afff]">
                    {(job.companyName || "C").charAt(0).toUpperCase()}
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/[0.07] bg-[#15161d] px-2 py-0.5 text-[10px] font-medium text-zinc-400">
                    <BriefcaseBusiness className="h-2.5 w-2.5" />
                    {job.jobType}
                  </span>
                </div>

                <div>
                  <p className="truncate text-[13.5px] font-semibold text-white">
                    {job.title}
                  </p>
                  <p className="mt-0.5 truncate text-[11.5px] text-zinc-500">
                    {job.companyName} · {job.isRemote ? "Remote" : job.location}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="text-[12px] font-medium text-zinc-300">
                    {formatSalary(job.minSalary, job.maxSalary, job.frequency)}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-zinc-600 transition-colors group-hover:text-white" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-6">
            <EmptyState
              compact
              icon={Compass}
              title="New roles are on the way"
              description="We could not reach the job feed right now. Try again in a moment."
            />
          </div>
        )}
      </section>
    </div>
  )
}
