"use client"

import { useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function useQueryParams() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateParams = useCallback(
    (
      updates: Record<string, string | null | undefined>,
      options: { resetPage?: boolean } = {}
    ) => {
      const params = new URLSearchParams(searchParams.toString())

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === undefined || value === "") {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      }

      if (options.resetPage !== false) {
        params.delete("page")
      }

      const query = params.toString()
      router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  const getList = useCallback(
    (key: string) =>
      (searchParams.get(key) ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
    [searchParams]
  )

  const toggleListValue = useCallback(
    (key: string, value: string) => {
      const current = (searchParams.get(key) ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)

      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]

      updateParams({ [key]: next.length ? next.join(",") : null })
    },
    [searchParams, updateParams]
  )

  const clearAll = useCallback(() => {
    const params = new URLSearchParams()
    const search = searchParams.get("search")
    if (search) params.set("search", search)
    const query = params.toString()
    router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false })
  }, [pathname, router, searchParams])

  return { searchParams, updateParams, getList, toggleListValue, clearAll }
}
