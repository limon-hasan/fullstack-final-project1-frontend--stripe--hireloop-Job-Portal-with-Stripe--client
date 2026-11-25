"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Lock, Send } from "lucide-react"

import { BrandButton } from "@/components/shared/brand-button"
import { toast } from "@/components/ui/toast"
import { createApplication } from "@/lib/actions/applications"
import { getApplicationsCount } from "@/lib/api/applications"
import { getUserPremiumbyId } from "@/lib/api/users"
import { authClient } from "@/lib/auth-client"
import type { JobApplicationPayload } from "@/types/applications"
import type { ManagedJob } from "@/types/jobs"

interface ApplyJobButtonProps {
  job: ManagedJob
}

const FREE_APPLICATION_LIMIT = 2

export const ApplyJobButton = ({ job }: ApplyJobButtonProps) => {
  const { data: session } = authClient.useSession()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const user = session?.user

  const handleApplyNow = async () => {
    if (!user) {
      router.push(`/signin?redirectTo=/browse-jobs/${job._id}`)
      return
    }

    if (user.role !== "seeker") {
      toast.add({
        title: "Seeker account required",
        description:
          "Only job seeker accounts can apply. Switch your role from account settings or create a seeker profile.",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const [premiumResult, countResult] = await Promise.all([
        getUserPremiumbyId(user.id),
        getApplicationsCount(`userId=${user.id}`),
      ])

      if (
        !premiumResult.premium &&
        countResult.count >= FREE_APPLICATION_LIMIT
      ) {
        toast.add({
          title: "You have reached the free limit",
          description:
            "Upgrade to HireLoop Pro for unlimited applications across every listing.",
        })
        router.push("/checkout")
        return
      }

      const application: JobApplicationPayload = {
        jobId: job._id,
        userId: user.id,
        applicantName: user.name || "Job Seeker",
        applicantEmail: user.email,
        jobTitle: job.title,
        companyName: job.companyName,
        location: job.location || "Remote",
        isRemote: Boolean(job.isRemote),
        jobType: job.jobType || "Full-time",
        minSalary: job.minSalary,
        maxSalary: job.maxSalary,
        status: "Pending",
        appliedAt: new Date().toISOString(),
      }

      const res = await createApplication(application)

      if (res?.insertedId) {
        toast.add({
          title: "Application submitted",
          description:
            "Your application is in. Track every update from your dashboard.",
        })
        router.push("/dashboard/seeker/applications")
        router.refresh()
        return
      }

      toast.add({
        title: "Could not submit application",
        description: "Please try again in a moment.",
      })
    } catch (error) {
      console.error("Failed to submit application:", error)
      toast.add({
        title: "Application failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong while applying. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <BrandButton
      onClick={handleApplyNow}
      disabled={isSubmitting}
      type="button"
      className="w-full sm:w-auto"
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Applying...
        </>
      ) : user ? (
        <>
          <Send className="mr-2 h-4 w-4" />
          Apply now
        </>
      ) : (
        <>
          <Lock className="mr-2 h-4 w-4" />
          Sign in to apply
        </>
      )}
    </BrandButton>
  )
}
