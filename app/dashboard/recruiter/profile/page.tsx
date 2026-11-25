import type { Metadata } from "next"

import { UserProfile } from "@/components/dashboard/UserProfile"
import { PageHeader } from "@/components/shared/page-header"
import { getApplications } from "@/lib/api/applications"
import { getJobs } from "@/lib/api/jobs"
import { getSession } from "@/lib/core/server"

export const metadata: Metadata = {
  title: "My Profile",
}

export default async function RecruiterProfilePage() {
  const session = await getSession()
  const recruiterId = session?.user?.id ?? ""

  const [jobs, applications] = await Promise.all([
    recruiterId
      ? getJobs(`recruiterId=${encodeURIComponent(recruiterId)}`)
      : Promise.resolve([]),
    getApplications(),
  ])

  const jobIds = new Set(jobs.map((job) => job._id))
  const relevantApps = applications.filter(
    (app) => !jobIds.size || jobIds.has(app.jobId)
  )

  const activeJobsCount = jobs.filter((job) => job.status === "Active").length
  const applicantsCount = jobs.reduce(
    (sum, job) => sum + (job.applicantsCount || 0),
    0
  )
  const hiredCount = relevantApps.filter(
    (app) => app.status === "Offered"
  ).length

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/recruiter" },
          { label: "Profile" },
        ]}
        title="My profile"
        description="Your public profile displayed on job postings and company pages."
      />

      <UserProfile
        role="recruiter"
        initialStats={{
          activeJobsCount,
          applicantsCount: Math.max(applicantsCount, relevantApps.length),
          hiredCount,
        }}
      />
    </div>
  )
}
