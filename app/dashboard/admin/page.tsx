import Link from "next/link"
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Building2,
  CreditCard,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { getApplications } from "@/lib/api/applications"
import { getJobs } from "@/lib/api/jobs"
import { getUsers } from "@/lib/api/users"
import { formatDate } from "@/lib/format"
import type { UserRole } from "@/types/users"

interface RawUser {
  _id: string
  name?: string | null
  email?: string | null
  role?: string | null
  createdAt?: string | Date
}

function normalizeRole(role?: string | null): UserRole {
  if (role === "admin" || role === "recruiter" || role === "seeker") {
    return role
  }
  return "seeker"
}

const ROLE_STYLES: Record<UserRole, string> = {
  admin: "border-amber-500/25 bg-amber-500/10 text-amber-300",
  recruiter: "border-[#5b4df5]/30 bg-[#5b4df5]/10 text-[#b7afff]",
  seeker: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
}

export default async function AdminDashboardPage() {
  const [usersResponse, jobs, applications] = await Promise.all([
    getUsers(),
    getJobs(),
    getApplications(),
  ])

  const rawUsers: RawUser[] = Array.isArray(usersResponse)
    ? usersResponse
    : (usersResponse?.users ?? [])

  const users = rawUsers
    .map((user) => ({
      id: String(user._id),
      name: user.name ?? "",
      email: user.email ?? "",
      role: normalizeRole(user.role),
      createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : "",
    }))
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    )

  const roleCounts = {
    seeker: users.filter((user) => user.role === "seeker").length,
    recruiter: users.filter((user) => user.role === "recruiter").length,
    admin: users.filter((user) => user.role === "admin").length,
  }

  const companies = new Set(
    jobs.map((job) => job.companyName).filter(Boolean)
  ).size

  const recentUsers = users.slice(0, 5)
  const recentJobs = [...jobs]
    .sort(
      (a, b) =>
        new Date(b.postedLabel || 0).getTime() -
        new Date(a.postedLabel || 0).getTime()
    )
    .slice(0, 5)

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        breadcrumbs={[{ label: "Admin" }, { label: "Overview" }]}
        eyebrow="Admin console"
        title="Platform overview"
        description="A live read on accounts, listings and applications across HireLoop."
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/admin/users"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-[#101116] px-4 text-[13px] font-medium text-zinc-200 transition-colors hover:border-white/20 hover:text-white"
            >
              <Users className="h-4 w-4 text-zinc-400" />
              Users
            </Link>
            <Link
              href="/dashboard/admin/jobs"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#5b4df5] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#6a5cff]"
            >
              <Briefcase className="h-4 w-4" />
              Jobs
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total users"
          value={users.length}
          icon={Users}
          hint={`${roleCounts.seeker} seekers`}
        />
        <StatCard
          label="Recruiters"
          value={roleCounts.recruiter}
          icon={UserCheck}
          accent="sky"
          hint={`${companies} companies hiring`}
        />
        <StatCard
          label="Job listings"
          value={jobs.length}
          icon={Briefcase}
          accent="violet"
          hint={`${jobs.filter((job) => job.status === "Active").length} active`}
        />
        <StatCard
          label="Applications"
          value={applications.length}
          icon={Activity}
          accent="emerald"
          hint="Platform-wide"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101116] xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-6 py-4">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Newest accounts
              </h2>
              <p className="mt-0.5 text-xs text-zinc-500">
                Recently registered users across every role.
              </p>
            </div>
            <Link
              href="/dashboard/admin/users"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#a99fff] transition-colors hover:text-white"
            >
              Manage users
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {recentUsers.length > 0 ? (
            <div className="divide-y divide-white/[0.05]">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-4 px-6 py-3.5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.07] bg-[#191a22] text-[11px] font-semibold text-zinc-200">
                    {(user.name || user.email || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-white">
                      {user.name || "Unnamed user"}
                    </p>
                    <p className="truncate text-[11px] text-zinc-500">
                      {user.email}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-[10.5px] font-medium capitalize ${ROLE_STYLES[user.role]}`}
                  >
                    {user.role}
                  </span>
                  <span className="hidden shrink-0 text-[11px] text-zinc-500 sm:block">
                    {formatDate(user.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6">
              <EmptyState
                compact
                icon={UserPlus}
                title="No accounts yet"
                description="Registered users will appear here as soon as they sign up."
              />
            </div>
          )}
        </section>

        <div className="space-y-5">
          <section className="rounded-2xl border border-white/[0.07] bg-[#101116] p-5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-[#15161d] text-zinc-400">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <h2 className="text-sm font-semibold text-white">
                Role distribution
              </h2>
            </div>

            <ul className="mt-4 space-y-3">
              {(["seeker", "recruiter", "admin"] as UserRole[]).map((role) => {
                const count = roleCounts[role]
                const percent = users.length
                  ? Math.round((count / users.length) * 100)
                  : 0
                const bar =
                  role === "admin"
                    ? "bg-amber-400"
                    : role === "recruiter"
                      ? "bg-[#8b81ff]"
                      : "bg-emerald-400"

                return (
                  <li key={role}>
                    <div className="mb-1 flex items-center justify-between text-[11.5px]">
                      <span className="capitalize text-zinc-400">{role}s</span>
                      <span className="font-medium text-zinc-300 tabular-nums">
                        {count} · {percent}%
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                      <div
                        className={`h-full rounded-full ${bar}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>

          <section className="rounded-2xl border border-white/[0.07] bg-[#101116] p-5">
            <h2 className="text-sm font-semibold text-white">Quick actions</h2>
            <div className="mt-3 space-y-2">
              {[
                {
                  label: "Review companies",
                  href: "/dashboard/admin/companies",
                  icon: Building2,
                },
                {
                  label: "Audit job listings",
                  href: "/dashboard/admin/jobs",
                  icon: Briefcase,
                },
                {
                  label: "Payment activity",
                  href: "/dashboard/admin/payments",
                  icon: CreditCard,
                },
              ].map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-[12.5px] font-medium text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {action.label}
                    <ArrowRight className="ml-auto h-3.5 w-3.5 text-zinc-600" />
                  </Link>
                )
              })}
            </div>
          </section>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101116]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-6 py-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Latest listings</h2>
            <p className="mt-0.5 text-xs text-zinc-500">
              The most recently posted roles on the platform.
            </p>
          </div>
          <Link
            href="/dashboard/admin/jobs"
            className="inline-flex items-center gap-1 text-xs font-medium text-[#a99fff] transition-colors hover:text-white"
          >
            All jobs
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentJobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-white/[0.06] bg-[#15161d] text-[10px] font-semibold tracking-[0.12em] text-zinc-500 uppercase">
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-4 py-3.5">Company</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Applicants</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Posted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-[13px]">
                {recentJobs.map((job) => (
                  <tr
                    key={job._id}
                    className="transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-3.5">
                      <Link
                        href={`/browse-jobs/${job._id}`}
                        className="inline-flex items-center gap-1 font-medium text-white transition-colors hover:text-[#c7c1ff]"
                      >
                        {job.title}
                        <ArrowUpRight className="h-3 w-3 text-zinc-600" />
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 text-zinc-300">
                      {job.companyName || "—"}
                    </td>
                    <td className="px-4 py-3.5 text-zinc-400">
                      {job.category}
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
                    <td className="px-6 py-3.5 text-right text-[11px] text-zinc-500">
                      {job.postedLabel || "—"}
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
              icon={Briefcase}
              title="No listings yet"
              description="Jobs posted by recruiters will show up here for review."
            />
          </div>
        )}
      </section>
    </div>
  )
}
