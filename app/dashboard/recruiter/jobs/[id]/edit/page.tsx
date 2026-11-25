import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { JobForm } from "@/components/dashboard/JobForm"
import { getJobById } from "@/lib/api/jobs"

export const metadata: Metadata = {
  title: "Edit job",
}

interface EditJobPageProps {
  params: Promise<{ id: string }>
}

export default async function EditJobPage({ params }: EditJobPageProps) {
  const { id } = await params
  const job = await getJobById(id)

  if (!job) notFound()

  return <JobForm mode="edit" job={job} />
}
