import { redirect } from "next/navigation"

interface JobsAliasPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function JobsAliasPage({
  searchParams,
}: JobsAliasPageProps) {
  const search = await searchParams
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(search)) {
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item))
    } else if (value) {
      params.set(key, value)
    }
  }

  redirect(`/browse-jobs${params.size ? `?${params.toString()}` : ""}`)
}
