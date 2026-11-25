import type { Metadata } from "next"
import { Briefcase, Building2, Globe, Users } from "lucide-react"

import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { getJobs } from "@/lib/api/jobs"
import { CompaniesClient, type AdminCompany } from "./_components/companies-client"

export const metadata: Metadata = {
  title: "Companies",
}

export default async function AdminCompaniesPage() {
  const jobs = await getJobs()

  const grouped = new Map<string, AdminCompany>()

  for (const job of jobs) {
    const name = job.companyName?.trim() || "Unattributed"
    const existing = grouped.get(name)

    if (!existing) {
      grouped.set(name, {
        name,
        jobs: 1,
        activeJobs: job.status === "Active" ? 1 : 0,
        applicants: job.applicantsCount || 0,
        categories: job.category ? [job.category] : [],
        locations: job.location ? [job.location] : [],
        isRemote: Boolean(job.isRemote),
        latestRole: job.title,
        latestRoleId: job._id,
      })
      continue
    }

    existing.jobs += 1
    existing.activeJobs += job.status === "Active" ? 1 : 0
    existing.applicants += job.applicantsCount || 0
    existing.isRemote = existing.isRemote || Boolean(job.isRemote)

    if (job.category && !existing.categories.includes(job.category)) {
      existing.categories.push(job.category)
    }
    if (job.location && !existing.locations.includes(job.location)) {
      existing.locations.push(job.location)
    }
  }

  const companies = Array.from(grouped.values())
  const totalApplicants = companies.reduce(
    (total, company) => total + company.applicants,
    0
  )
  const activeListings = jobs.filter((job) => job.status === "Active").length
  const remoteCompanies = companies.filter(
    (company) => company.isRemote
  ).length

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        breadcrumbs={[
          { label: "Admin", href: "/dashboard/admin" },
          { label: "Companies" },
        ]}
        title="Companies"
        description="Every employer with a presence on HireLoop, grouped from live job listings."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Companies"
          value={companies.length}
          icon={Building2}
          hint="With at least one listing"
        />
        <StatCard
          label="Active listings"
          value={activeListings}
          icon={Briefcase}
          accent="violet"
          hint={`${jobs.length} total listings`}
        />
        <StatCard
          label="Applicants"
          value={totalApplicants}
          icon={Users}
          accent="sky"
          hint="Across all companies"
        />
        <StatCard
          label="Remote-friendly"
          value={remoteCompanies}
          icon={Globe}
          accent="emerald"
          hint="Offer remote roles"
        />
      </div>

      <CompaniesClient companies={companies} />
    </div>
  )
}
