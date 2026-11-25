import type { Metadata } from "next"

import { UserProfile } from "@/components/dashboard/UserProfile"
import { PageHeader } from "@/components/shared/page-header"

export const metadata: Metadata = {
  title: "My Profile",
}

export default function AdminProfilePage() {
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

      <UserProfile role="admin" />
    </div>
  )
}

