import type { Metadata } from "next"

import { UserProfile } from "@/components/dashboard/UserProfile"
import { PageHeader } from "@/components/shared/page-header"
import { getJobs } from "@/lib/api/jobs"
import { getUsers } from "@/lib/api/users"

export const metadata: Metadata = {
  title: "My Profile",
}

export default async function AdminProfilePage() {
  const [usersResponse, jobs] = await Promise.all([getUsers(), getJobs()])
  const usersList = Array.isArray(usersResponse)
    ? usersResponse
    : (usersResponse?.users ?? [])

  const companiesCount = new Set(
    jobs.map((job) => job.companyName).filter(Boolean)
  ).size

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/admin" },
          { label: "Profile" },
        ]}
        title="Admin profile"
        description="Your administrator identity and platform access details."
      />

      <UserProfile
        role="admin"
        initialStats={{
          usersCount: usersList.length,
          companiesCount,
          jobsCount: jobs.length,
        }}
      />
    </div>
  )
}
