import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getApplications } from "@/lib/api/applications"
import { ApplicationsBoard } from "./_components/applications-board"

export default async function MyApplicationsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect("/signin?redirectTo=/dashboard/seeker/applications")
  }

  const data = await getApplications(`userId=${session.user.id}`)
  const applications = Array.isArray(data) ? data : []

  return <ApplicationsBoard applications={applications} />
}
