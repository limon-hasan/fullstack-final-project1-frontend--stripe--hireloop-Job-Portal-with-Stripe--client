import type { Metadata } from "next"

import { AccountSettings } from "@/components/dashboard/AccountSettings"
import { PageHeader } from "@/components/shared/page-header"

export const metadata: Metadata = {
  title: "Settings",
}

export default function SeekerSettingsPage() {
  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/seeker" },
          { label: "Settings" },
        ]}
        title="Account settings"
        description="Update your profile, manage notifications and keep your account secure."
      />

      <AccountSettings role="seeker" />
    </div>
  )
}
