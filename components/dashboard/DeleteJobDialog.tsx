"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Trash2Icon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { deleteJob } from "@/lib/actions/jobs"
import type { ManagedJob } from "@/types/jobs"

export function DeleteJobDialog({ job }: { job: ManagedJob }) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async (event: React.MouseEvent) => {
    event.preventDefault()
    setIsDeleting(true)

    try {
      const result = await deleteJob(job._id)

      if (!result?.deletedCount) {
        throw new Error("The listing could not be deleted. Please try again.")
      }

      setOpen(false)
      toast.add({
        title: "Job deleted",
        description: `${job.title} has been permanently removed.`,
      })
      router.push("/dashboard/recruiter/jobs")
      router.refresh()
    } catch (error) {
      toast.add({
        title: "Could not delete job",
        description:
          error instanceof Error ? error.message : "Please try again.",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            variant="destructive"
            size="icon"
            title="Delete job"
            aria-label={`Delete ${job.title}`}
            className="h-8 w-8 rounded-lg"
          >
            <Trash2Icon className="h-3.5 w-3.5" />
          </Button>
        }
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete this job?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently deletes <strong>{job.title}</strong> and removes it
            from the public job board. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            variant="destructive"
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isDeleting ? "Deleting…" : "Delete job"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
