import type { Metadata } from "next"
import { CheckCircle2, FileText, Users, Video } from "lucide-react"

import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { getApplications } from "@/lib/api/applications"
import { getJobs } from "@/lib/api/jobs"
import { getSession } from "@/lib/core/server"
import { RecruiterApplicationsClient } from "./_components/recruiter-applications-client"

export const metadata: Metadata = {
  title: "Applications",
}

export default async function RecruiterApplicationsPage() {
  const session = await getSession()
  const recruiterId = session?.user?.id ?? ""

  const [jobs, applications] = await Promise.all([
    getJobs(`recruiterId=${encodeURIComponent(recruiterId)}`),
    getApplications(),
  ])

  const jobIds = new Set(jobs.map((job) => job._id))
  const relevant = jobIds.size
    ? applications.filter((app) => jobIds.has(app.jobId))
    : applications

  const inReview = relevant.filter((app) =>
    ["Review", "Under Review", "Shortlisted"].includes(app.status)
  ).length
  const interviews = relevant.filter((app) => app.status === "Interview").length
  const offers = relevant.filter((app) => app.status === "Offered").length

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/recruiter" },
          { label: "Applications" },
        ]}
        title="All applications"
        description="Every candidate across your listings, with status updates you can change in one click."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total applications"
          value={relevant.length}
          icon={Users}
          hint="Across your roles"
        />
        <StatCard
          label="In review"
          value={inReview}
          icon={FileText}
          accent="amber"
          hint="Needs a decision"
        />
        <StatCard
          label="Interviews"
          value={interviews}
          icon={Video}
          accent="violet"
          hint="In progress"
        />
        <StatCard
          label="Offers"
          value={offers}
          icon={CheckCircle2}
          accent="emerald"
          hint="Sent to candidates"
        />
      </div>

      <RecruiterApplicationsClient applications={relevant} />
    </div>
  )
}
