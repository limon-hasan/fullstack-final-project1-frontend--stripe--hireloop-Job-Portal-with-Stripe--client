import { PageHeader } from "@/components/shared/page-header"
import { getApplications } from "@/lib/api/applications"
import { getJobById } from "@/lib/api/jobs"
import { ApplicationsTable } from "./_components/applications-table"

interface JobApplicationsPageProps {
  params: Promise<{ id: string }>
}

export default async function JobApplicationsPage({
  params,
}: JobApplicationsPageProps) {
  const { id } = await params

  const [job, applications] = await Promise.all([
    getJobById(id),
    getApplications(`jobId=${encodeURIComponent(id)}`),
  ])

  const jobTitle = job?.title ?? "Job Listing"
  const description = job
    ? `Review applicants for ${job.title} at ${job.companyName} and update their hiring status.`
    : "Review applicants and update their hiring status."

  return (
    <div className="w-full space-y-6 pb-12 text-white">
      <PageHeader
        breadcrumbs={[
          { label: "Manage Jobs" },
          { label: jobTitle },
          { label: "Applications" },
        ]}
        title="Job Applications"
        description={description}
      />

      <ApplicationsTable initialApplications={applications} />
    </div>
  )
}
