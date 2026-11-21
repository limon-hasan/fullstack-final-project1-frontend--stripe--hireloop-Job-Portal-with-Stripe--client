"use client"

import { useState } from "react"
import {  useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { createApplication } from "@/lib/actions/applications"
import type { ManagedJob } from "@/types/jobs"
import type { JobApplicationPayload } from "@/types/applications"
import { getApplicationsCount } from "@/lib/api/applications"
import { toast } from "@/components/ui/toast"
import { getUserPremiumbyId } from "@/lib/api/users"

interface ApplyJobButtonProps {
  job: ManagedJob
}

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

    if (user.role === "seeker") {
      // is premum user
      const premimumResult = await getUserPremiumbyId(user.id)
      console.log("Premium user: ", premimumResult)

      // number of jobs applied by the user
      const countResult = await getApplicationsCount(`userId=${user.id}`)

      // less more than 2 and not premium user
      if (!premimumResult.premium && countResult.count >= 2) {
        // redirect to the payment page
        router.push(`/checkout`)
        return
      } else {
        try {
          setIsSubmitting(true)

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
          console.log("Job application result: ", res)
          if (res.insertedId) {
            console.log("Application submitted successfully")
            toast.add({
              title: "Application is submitted",
              description: "Your application has been submitted successfully!",
            })
            router.push("/dashboard/seeker/applications")
            router.refresh()
          }
        } catch (error) {
          console.error("Failed to submit application:", error)
        } finally {
          setIsSubmitting(false)
        }
      }
    } else {
      console.log("User is not a job seeker")
    }
  }

  return (
    <button
      onClick={handleApplyNow}
      disabled={isSubmitting}
      type="button"
      className="cursor-pointer rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isSubmitting ? "Applying..." : "Apply Now"}
    </button>
  )
}
