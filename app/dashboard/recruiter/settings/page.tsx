import type { Metadata } from "next"

import { AccountSettings } from "@/components/dashboard/AccountSettings"
import { PageHeader } from "@/components/shared/page-header"

export const metadata: Metadata = {
  title: "Settings",
}

export default function RecruiterSettingsPage() {
  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/recruiter" },
          { label: "Settings" },
        ]}
        title="Recruiter settings"
        description="Manage your recruiter profile, notifications and account security."
      />

      <AccountSettings role="recruiter" />
    </div>
  )
}
