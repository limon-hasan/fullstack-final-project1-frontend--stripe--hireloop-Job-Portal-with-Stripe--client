import Link from "next/link"
import {
  Code2,
  FileText,
  Globe,
  MapPin,
  Megaphone,
  PenTool,
  Pencil,
  Plus,
  Server,
  ShieldCheck,
  Users,
} from "lucide-react"

import { DeleteJobDialog } from "@/components/dashboard/DeleteJobDialog"
import { BrandButton } from "@/components/shared/brand-button"
import { PageHeader } from "@/components/shared/page-header"
import { getJobs } from "@/lib/api/jobs"
import { getSession } from "@/lib/core/server"
import type { ManagedJob } from "@/types/jobs"

export type { ManagedJob } from "@/types/jobs"

function getCategoryStyle(category: string) {
  switch (category) {
    case "Design & Creative":
      return {
        icon: PenTool,
        textColor: "text-amber-400",
        iconColor: "text-amber-400",
      }
    case "Data & AI":
      return {
        icon: Server,
        textColor: "text-cyan-400",
        iconColor: "text-cyan-400",
      }
    case "Marketing & Sales":
      return {
        icon: Megaphone,
        textColor: "text-purple-400",
        iconColor: "text-purple-400",
      }
    case "Product Management":
      return {
        icon: ShieldCheck,
        textColor: "text-indigo-400",
        iconColor: "text-indigo-400",
      }
    default:
      return {
        icon: Code2,
        textColor: "text-sky-400",
        iconColor: "text-sky-400",
      }
  }
}

function formatCompensation(min: number, max: number, frequency: string) {
  const formatAmount = (val: number) =>
    val >= 1000 ? `€${Math.round(val / 1000)}k` : `€${val}`

  const shortFreq =
    frequency === "per year"
      ? "/ yr"
      : frequency === "per month"
        ? "/ mo"
        : "/ hr"

  return `${formatAmount(min)} – ${formatAmount(max)} ${shortFreq}`
}

function formatDeadline(dateString: string) {
  if (!dateString) return "No deadline"
  const date = new Date(`${dateString}T00:00:00`)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}

export default async function ManageJobsPage() {
  const session = await getSession()
  const jobs = await getJobs(`recruiterId=${session?.user?.id ?? ""}`)

  return (
    <div className="w-full space-y-6 pb-12 text-white">
      <PageHeader
        breadcrumbs={[
          { label: "Manage Jobs" },
          { label: "Job Listings & Postings" },
        ]}
        title="Manage Job Posts"
        description="Review live listings, monitor applicants, and update job details across your organization."
        action={
          <Link href="/dashboard/recruiter/jobs/new">
            <BrandButton className="shrink-0 px-5">
              <Plus className="mr-2 h-4 w-4" />
              New Job Post
            </BrandButton>
          </Link>
        }
      />

      {/* Responsive Table Card */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#121318]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/[0.06] bg-[#15161d] text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                <th className="px-6 py-4">Job Title & Dept</th>
                <th className="px-4 py-4">Company & Location</th>
                <th className="px-4 py-4">Type</th>
                <th className="px-4 py-4">Compensation</th>
                <th className="px-4 py-4">Applicants</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Deadline</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.05] text-sm">
              {jobs.map((job: ManagedJob) => {
                const {
                  icon: CategoryIcon,
                  textColor,
                  iconColor,
                } = getCategoryStyle(job.category)
                const isActive = job.status === "Active"

                return (
                  <tr
                    key={job._id}
                    className="transition-colors hover:bg-white/[0.02]"
                  >
                    {/* 1. Job Title & Dept */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-[#191a22]">
                          <CategoryIcon className={`h-4 w-4 ${iconColor}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {job.title}
                          </p>
                          <p className={`text-xs font-medium ${textColor}`}>
                            {job.category}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* 2. Company & Location */}
                    <td className="px-4 py-4">
                      <p className="font-medium text-zinc-200">
                        {job.companyName}
                      </p>
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-400">
                        {job.isRemote ? (
                          <>
                            <Globe className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                            <span>Remote ({job.location})</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                            <span>{job.location}</span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* 3. Job Type */}
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center rounded-full border border-white/[0.08] bg-[#191a21] px-3 py-1 text-xs font-medium text-zinc-300">
                        {job.jobType}
                      </span>
                    </td>

                    {/* 4. Compensation */}
                    <td className="px-4 py-4 font-semibold text-zinc-200">
                      {formatCompensation(
                        job.minSalary,
                        job.maxSalary,
                        job.frequency
                      )}
                    </td>

                    {/* 5. Applicants */}
                    <td className="px-4 py-4">
                      <Link
                        href={`/dashboard/recruiter/jobs/${job._id}/applications`}
                        className={`inline-flex items-center gap-1.5 text-xs font-medium underline-offset-4 hover:underline ${
                          isActive ? "text-[#8b81ff]" : "text-zinc-400"
                        }`}
                      >
                        <Users className="h-3.5 w-3.5 shrink-0" />
                        <span>{job.applicantsCount} Candidates</span>
                      </Link>
                    </td>

                    {/* 6. Status */}
                    <td className="px-4 py-4">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-zinc-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
                          Expired
                        </span>
                      )}
                    </td>

                    {/* 7. Deadline */}
                    <td className="px-4 py-4">
                      <p className="text-xs font-medium text-zinc-200">
                        {formatDeadline(job.deadline)}
                      </p>
                      <p className="mt-0.5 text-[11px] text-zinc-500">
                        {job.postedLabel}
                      </p>
                    </td>

                    {/* 8. Actions (Compact Icon Buttons) */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/recruiter/jobs/${job._id}/applications`}
                          title="View Applications"
                          aria-label="View Applications"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-[#191a21] text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                        >
                          <FileText className="h-4 w-4" />
                        </Link>

                        <Link
                          href={`/dashboard/recruiter/jobs/${job._id}/edit`}
                          title="Update Job"
                          aria-label="Update Job"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-[#191a21] text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>

                        <DeleteJobDialog job={job} />
                      </div>
                    </td>
                  </tr>
                )
              })}

              {jobs.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-sm text-zinc-400"
                  >
                    No job listings found. Click{" "}
                    <span className="font-medium text-white">New Job Post</span>{" "}
                    to create your first listing.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
