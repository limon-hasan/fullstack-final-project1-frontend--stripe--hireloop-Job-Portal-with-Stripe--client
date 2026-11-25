import type { Metadata } from "next"
import { Briefcase, Clock, Globe, Users } from "lucide-react"

import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { getJobs } from "@/lib/api/jobs"
import { AdminJobsClient } from "./_components/admin-jobs-client"

export const metadata: Metadata = {
  title: "Jobs",
}

interface AdminJobsPageProps {
  searchParams: Promise<{ company?: string }>
}

export default async function AdminJobsPage({
  searchParams,
}: AdminJobsPageProps) {
  const { company } = await searchParams
  const jobs = await getJobs()

  const active = jobs.filter((job) => job.status === "Active").length
  const applicants = jobs.reduce(
    (total, job) => total + (job.applicantsCount || 0),
    0
  )
  const remote = jobs.filter((job) => job.isRemote).length

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        breadcrumbs={[
          { label: "Admin", href: "/dashboard/admin" },
          { label: "Jobs" },
        ]}
        title="Job listings"
        description="Audit every role published to HireLoop and jump into the public listing."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total listings"
          value={jobs.length}
          icon={Briefcase}
          hint="Across all companies"
        />
        <StatCard
          label="Active"
          value={active}
          icon={Clock}
          accent="emerald"
          hint={`${jobs.length - active} expired`}
        />
        <StatCard
          label="Applicants"
          value={applicants}
          icon={Users}
          accent="sky"
          hint="Platform-wide"
        />
        <StatCard
          label="Remote roles"
          value={remote}
          icon={Globe}
          accent="violet"
          hint="Open to distributed talent"
        />
      </div>

      <AdminJobsClient jobs={jobs} initialCompany={company ?? ""} />
    </div>
  )
}
