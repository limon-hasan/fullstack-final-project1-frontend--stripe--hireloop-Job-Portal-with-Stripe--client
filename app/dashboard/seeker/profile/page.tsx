import type { Metadata } from "next"

import { UserProfile } from "@/components/dashboard/UserProfile"
import { PageHeader } from "@/components/shared/page-header"
import { getApplications } from "@/lib/api/applications"
import { getSession } from "@/lib/core/server"

export const metadata: Metadata = {
  title: "My Profile",
}

export default async function SeekerProfilePage() {
  const session = await getSession()
  const userId = session?.user?.id ?? ""

  const applications = userId
    ? await getApplications(`userId=${encodeURIComponent(userId)}`)
    : []

  const reviewedCount = applications.filter((app) =>
    ["Review", "Under Review", "Shortlisted", "Interview", "Offered"].includes(
      app.status
    )
  ).length

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/seeker" },
          { label: "Profile" },
        ]}
        title="My profile"
        description="Your public profile shown to recruiters and hiring managers."
      />

      <UserProfile
        role="seeker"
        initialStats={{
          applicationsCount: applications.length,
          profileViewsCount: reviewedCount,
        }}
      />
    </div>
  )
}
