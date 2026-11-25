"use client"

import { useCallback, useEffect, useState } from "react"

import { STORAGE_EVENT, STORAGE_KEYS, readStorage, writeStorage } from "@/lib/storage"
import type { ManagedJob } from "@/types/jobs"

function readSavedJobs() {
  const stored = readStorage<ManagedJob[]>(STORAGE_KEYS.savedJobs, [])
  return Array.isArray(stored) ? stored.filter((job) => job && job._id) : []
}

export function useSavedJobs() {
  const [savedJobs, setSavedJobs] = useState<ManagedJob[]>([])
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const sync = () => {
      setSavedJobs(readSavedJobs())
      setIsReady(true)
    }

    sync()
    window.addEventListener("storage", sync)
    window.addEventListener(STORAGE_EVENT, sync)

    return () => {
      window.removeEventListener("storage", sync)
      window.removeEventListener(STORAGE_EVENT, sync)
    }
  }, [])

  const isSaved = useCallback(
    (jobId: string) => savedJobs.some((job) => job._id === jobId),
    [savedJobs]
  )

  const toggleSaved = useCallback((job: ManagedJob) => {
    const current = readSavedJobs()
    const exists = current.some((item) => item._id === job._id)
    const next = exists
      ? current.filter((item) => item._id !== job._id)
      : [job, ...current]

    writeStorage(STORAGE_KEYS.savedJobs, next)
    setSavedJobs(next)
    return !exists
  }, [])

  const removeSaved = useCallback((jobId: string) => {
    const next = readSavedJobs().filter((job) => job._id !== jobId)
    writeStorage(STORAGE_KEYS.savedJobs, next)
    setSavedJobs(next)
  }, [])

  const clearSaved = useCallback(() => {
    writeStorage(STORAGE_KEYS.savedJobs, [])
    setSavedJobs([])
  }, [])

  return { savedJobs, isReady, isSaved, toggleSaved, removeSaved, clearSaved }
}
