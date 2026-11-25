import type { Metadata } from "next"

import { UserProfile } from "@/components/dashboard/UserProfile"
import { PageHeader } from "@/components/shared/page-header"

export const metadata: Metadata = {
  title: "My Profile",
}

export default function SeekerProfilePage() {
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

      <UserProfile role="seeker" />
    </div>
  )
}

