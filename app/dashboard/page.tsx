import { redirect } from "next/navigation"

import { getSession } from "@/lib/core/server"

export default async function DashboardRootPage() {
  const session = await getSession()
  const role = (session?.user?.role as string) || "seeker"

  if (role === "recruiter") redirect("/dashboard/recruiter")
  if (role === "admin") redirect("/dashboard/admin")
  redirect("/dashboard/seeker")
}

