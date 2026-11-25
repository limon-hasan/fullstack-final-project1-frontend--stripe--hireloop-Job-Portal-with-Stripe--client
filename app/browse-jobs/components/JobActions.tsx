"use client"

import { Bookmark, Share2 } from "lucide-react"

import { toast } from "@/components/ui/toast"
import { useSavedJobs } from "@/hooks/use-saved-jobs"
import { cn } from "@/lib/utils"
import type { ManagedJob } from "@/types/jobs"

export function JobActions({ job }: { job: ManagedJob }) {
  const { isSaved, toggleSaved } = useSavedJobs()
  const saved = isSaved(job._id)

  const handleSave = () => {
    const added = toggleSaved(job)
    toast.add({
      title: added ? "Saved to your list" : "Removed from saved jobs",
      description: added
        ? "You can find it under Saved jobs in your dashboard."
        : "This role was removed from your saved jobs.",
    })
  }

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : ""

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: job.title, url })
        return
      }

      await navigator.clipboard.writeText(url)
      toast.add({
        title: "Link copied",
        description: "The job link is on your clipboard.",
      })
    } catch {
      toast.add({
        title: "Could not share",
        description: "Copy the address bar link to share this role.",
      })
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleSave}
        aria-label={saved ? "Remove from saved jobs" : "Save job"}
        aria-pressed={saved}
        className={cn(
          "flex h-10 items-center gap-2 rounded-xl border px-3 text-xs font-medium transition-colors",
          saved
            ? "border-[#5b4df5]/40 bg-[#5b4df5]/15 text-[#c7c1ff]"
            : "border-white/[0.08] bg-[#14151b] text-zinc-300 hover:border-white/20 hover:text-white"
        )}
      >
        <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
        <span className="hidden sm:inline">{saved ? "Saved" : "Save"}</span>
      </button>

      <button
        type="button"
        onClick={handleShare}
        aria-label="Share job"
        className="flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-[#14151b] px-3 text-xs font-medium text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
      >
        <Share2 className="h-4 w-4" />
        <span className="hidden sm:inline">Share</span>
      </button>
    </div>
  )
}
