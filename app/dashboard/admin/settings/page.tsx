import type { Metadata } from "next"

import { AccountSettings } from "@/components/dashboard/AccountSettings"
import { PageHeader } from "@/components/shared/page-header"

export const metadata: Metadata = {
  title: "Settings",
}

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        breadcrumbs={[
          { label: "Admin", href: "/dashboard/admin" },
          { label: "Settings" },
        ]}
        title="Admin settings"
        description="Platform preferences and your personal account security."
      />

      <AccountSettings role="admin" />
    </div>
  )
}
