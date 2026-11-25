import type { Metadata } from "next"

import { CompanyProfileForm } from "@/components/dashboard/CompanyProfileForm"
import { PageHeader } from "@/components/shared/page-header"
import { getJobs } from "@/lib/api/jobs"
import { getSession } from "@/lib/core/server"

export const metadata: Metadata = {
  title: "My company",
}

export default async function RecruiterCompanyPage() {
  const session = await getSession()
  const recruiterId = session?.user?.id ?? ""
  const jobs = await getJobs(`recruiterId=${encodeURIComponent(recruiterId)}`)
  const defaultName = jobs[0]?.companyName ?? ""

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/recruiter" },
          { label: "My company" },
        ]}
        title="Company profile"
        description="Shape how your team appears to candidates across job listings and search results."
      />

      <CompanyProfileForm defaultName={defaultName} />
    </div>
  )
}
