import type { Metadata } from "next"

import { UserProfile } from "@/components/dashboard/UserProfile"
import { PageHeader } from "@/components/shared/page-header"

export const metadata: Metadata = {
  title: "My Profile",
}

export default function RecruiterProfilePage() {
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

      <UserProfile role="recruiter" />
    </div>
  )
}

