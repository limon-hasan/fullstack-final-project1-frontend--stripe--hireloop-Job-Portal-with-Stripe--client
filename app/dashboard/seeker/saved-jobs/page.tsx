import type { Metadata } from "next"

import { PageHeader } from "@/components/shared/page-header"
import { SavedJobsClient } from "./_components/saved-jobs-client"

export const metadata: Metadata = {
  title: "Saved jobs",
}

export default function SavedJobsPage() {
  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/seeker" },
          { label: "Saved jobs" },
        ]}
        title="Saved jobs"
        description="Roles you bookmarked while browsing. Saved locally in this browser so you can pick up where you left off."
      />

      <SavedJobsClient />
    </div>
  )
}
