"use client"

import { useState } from "react"
import { Users } from "lucide-react"
import type {
  ApplicationStatus,
  ManagedApplication,
} from "@/types/applications"
import { StatusBadge } from "./status-badge"
import { StatusSelect } from "./status-select"
import { updateApplicationStatus } from "@/lib/actions/applications"
import { toast } from "@/components/ui/toast"

interface ApplicationsTableProps {
  initialApplications: ManagedApplication[]
}

function formatRelativeTime(isoString: string) {
  if (!isoString) return "—"
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return "—"

  const diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diffInSeconds < 60) return "Just now"

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}

export function ApplicationsTable({
  initialApplications,
}: ApplicationsTableProps) {
  const [applications, setApplications] =
    useState<ManagedApplication[]>(initialApplications)

  const handleStatusChange = async (
    applicationId: string,
    nextStatus: ApplicationStatus
  ) => {
    try {
      const result = await updateApplicationStatus(applicationId, {
        status: nextStatus,
      })

      if (result?.modifiedCount > 0) {
        setApplications((prev) =>
          prev.map((app) =>
            app._id === applicationId ? { ...app, status: nextStatus } : app
          )
        )
        toast.add({
          title: "Status updated",
          description: `The applicant is now marked as ${nextStatus}.`,
        })
      }
    } catch (error) {
      toast.add({
        title: "Could not update status",
        description:
          error instanceof Error ? error.message : "Please try again.",
      })
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#121318]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left">
          <thead>
            <tr className="border-b border-white/[0.06] bg-[#15161d] text-xs font-medium text-zinc-400">
              <th className="px-6 py-4">Applicant</th>
              <th className="px-4 py-4">Applied</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-6 py-4">Update status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/[0.05] text-sm">
            {applications.map((app) => (
              <tr
                key={app._id}
                className="transition-colors hover:bg-white/[0.02]"
              >
                {/* 1. Applicant */}
                <td className="px-6 py-4 font-medium text-white">
                  {app.applicantEmail || app.applicantName}
                </td>

                {/* 2. Applied */}
                <td className="px-4 py-4 text-xs text-zinc-300">
                  <span suppressHydrationWarning>
                    {formatRelativeTime(app.appliedAt)}
                  </span>
                </td>

                {/* 3. Status */}
                <td className="px-4 py-4">
                  <StatusBadge status={app.status} />
                </td>

                {/* 4. Update status */}
                <td className="px-6 py-4">
                  <StatusSelect
                    value={app.status}
                    onChange={(nextStatus) =>
                      handleStatusChange(app._id, nextStatus)
                    }
                  />
                </td>
              </tr>
            ))}

            {applications.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-14 text-center text-sm text-zinc-400"
                >
                  <div className="mx-auto flex max-w-sm flex-col items-center gap-2">
                    <Users className="h-8 w-8 text-zinc-600" />
                    <p className="font-medium text-zinc-200">
                      No applications received yet
                    </p>
                    <p className="text-xs text-zinc-500">
                      Candidates who apply to this job will appear here for
                      review.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
