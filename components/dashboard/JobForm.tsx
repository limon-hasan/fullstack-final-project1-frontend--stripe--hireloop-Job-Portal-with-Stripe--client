"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Building2,
  Globe,
  Loader2,
  MapPin,
  X,
} from "lucide-react"

import { BrandButton } from "@/components/shared/brand-button"
import {
  FormField,
  SelectField,
  TextareaField,
  TextField,
} from "@/components/shared/form-field"
import { PageHeader } from "@/components/shared/page-header"
import { SectionCard } from "@/components/shared/section-card"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/toast"
import { createJob, updateJob } from "@/lib/actions/jobs"
import { useSession } from "@/lib/auth-client"
import {
  JOB_CATEGORIES,
  JOB_TYPES,
  SALARY_FREQUENCIES,
} from "@/lib/constants/jobs"
import type {
  JobCategory,
  JobPayload,
  JobStatus,
  JobType,
  ManagedJob,
  SalaryFrequency,
} from "@/types/jobs"

export type { JobPayload } from "@/types/jobs"

interface JobFormProps {
  mode?: "create" | "edit"
  job?: ManagedJob | null
}

type FormState = {
  title: string
  companyName: string
  recruiterId: string
  category: JobCategory
  jobType: JobType
  isRemote: boolean
  location: string
  deadline: string
  minSalary: string
  maxSalary: string
  frequency: SalaryFrequency
  responsibilities: string
  requirements: string
  status: JobStatus
}

const EMPTY_FORM: FormState = {
  title: "",
  companyName: "",
  recruiterId: "",
  category: "Engineering & Tech",
  jobType: "Full-time",
  isRemote: false,
  location: "",
  deadline: "",
  minSalary: "",
  maxSalary: "",
  frequency: "per hour",
  responsibilities: "",
  requirements: "",
  status: "Active",
}

function toDateInput(value?: string) {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return date.toISOString().slice(0, 10)
}

export function JobForm({ mode = "create", job }: JobFormProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const isEdit = mode === "edit" && Boolean(job)

  const [formData, setFormData] = useState<FormState>(() =>
    job
      ? {
          title: job.title ?? "",
          companyName: job.companyName ?? "",
          recruiterId: job.recruiterId ?? "",
          category: job.category ?? "Engineering & Tech",
          jobType: job.jobType ?? "Full-time",
          isRemote: Boolean(job.isRemote),
          location: job.location ?? "",
          deadline: toDateInput(job.deadline),
          minSalary: job.minSalary ? String(job.minSalary) : "",
          maxSalary: job.maxSalary ? String(job.maxSalary) : "",
          frequency: job.frequency ?? "per hour",
          responsibilities: job.responsibilities ?? "",
          requirements: job.requirements ?? "",
          status: job.status ?? "Active",
        }
      : EMPTY_FORM
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isEdit || !session?.user?.id) return
    setFormData((prev) =>
      prev.recruiterId
        ? prev
        : { ...prev, recruiterId: session.user.id as string }
    )
  }, [isEdit, session?.user?.id])

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const minSalary = Number(formData.minSalary) || 0
    const maxSalary = Number(formData.maxSalary) || 0

    if (minSalary && maxSalary && minSalary > maxSalary) {
      toast.add({
        title: "Check the salary range",
        description: "The minimum salary cannot be higher than the maximum.",
      })
      return
    }

    const payload: JobPayload = {
      title: formData.title.trim(),
      companyName: formData.companyName.trim(),
      recruiterId:
        formData.recruiterId || (session?.user?.id as string | undefined) || "",
      category: formData.category,
      jobType: formData.jobType,
      isRemote: formData.isRemote,
      location: formData.location.trim(),
      deadline: formData.deadline,
      minSalary,
      maxSalary,
      frequency: formData.frequency,
      responsibilities: formData.responsibilities.trim(),
      requirements: formData.requirements.trim(),
      applicantsCount: job?.applicantsCount ?? 0,
      status: formData.status,
    }

    setIsSubmitting(true)
    try {
      if (isEdit && job) {
        await updateJob(job._id, payload)
        toast.add({
          title: "Job updated",
          description: "Your changes are now live on the job board.",
        })
        router.push(`/dashboard/recruiter/jobs/${job._id}`)
      } else {
        const result = await createJob(payload)
        if (!result?.insertedId) {
          throw new Error("The job could not be created. Please try again.")
        }
        toast.add({
          title: "Job published",
          description: "Your listing is now visible to candidates.",
        })
        router.push("/dashboard/recruiter/jobs")
      }
      router.refresh()
    } catch (error) {
      toast.add({
        title: isEdit ? "Could not update job" : "Could not publish job",
        description:
          error instanceof Error ? error.message : "Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6 pb-12 text-white">
      <PageHeader
        breadcrumbs={[
          { label: "Manage jobs", href: "/dashboard/recruiter/jobs" },
          { label: isEdit ? "Edit listing" : "Create new listing" },
        ]}
        title={isEdit ? "Edit job posting" : "Post a new job"}
        description={
          isEdit
            ? "Update the listing details. Changes appear instantly on the public job board."
            : "Fill in the position specifications to attract qualified talent across our network."
        }
        action={
          <div className="flex items-center gap-2">
            <Link
              href={
                isEdit && job
                  ? `/dashboard/recruiter/jobs/${job._id}`
                  : "/dashboard/recruiter/jobs"
              }
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-[#101116] px-4 text-[13px] font-medium text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
            >
              <X className="h-4 w-4" />
              Cancel
            </Link>
            <BrandButton
              type="submit"
              disabled={isSubmitting}
              className="h-10 shrink-0 px-5"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              {isEdit ? "Save changes" : "Publish job"}
            </BrandButton>
          </div>
        }
      />

      <SectionCard
        title="Basic information"
        description="The essentials candidates see first."
        icon={Building2}
      >
        <TextField
          id="title"
          name="title"
          required
          label="Job title"
          placeholder="Frontend Developer"
          value={formData.title}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextField
            id="companyName"
            name="companyName"
            required
            label="Company name"
            icon={Building2}
            placeholder="HirePulse Network"
            value={formData.companyName}
            onChange={handleChange}
          />

          <SelectField
            id="category"
            name="category"
            label={
              <>
                Job category <span className="text-[#7c73f8]">*</span>
              </>
            }
            options={JOB_CATEGORIES}
            value={formData.category}
            onChange={handleChange}
          />
        </div>

        <FormField
          label={
            <>
              Job type <span className="text-[#7c73f8]">*</span>
            </>
          }
        >
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {JOB_TYPES.map((type) => {
              const isSelected = formData.jobType === type
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, jobType: type }))
                  }
                  className={`h-11 cursor-pointer rounded-xl border text-sm font-medium transition-all ${
                    isSelected
                      ? "border-[#5b4df5] bg-[#5b4df5]/10 text-white shadow-[0_0_0_1px_rgba(91,77,245,0.3)]"
                      : "border-white/[0.05] bg-[#191a21] text-zinc-400 hover:border-white/15 hover:text-zinc-200"
                  }`}
                >
                  {type}
                </button>
              )
            })}
          </div>
        </FormField>
      </SectionCard>

      <SectionCard
        title="Location, compensation & timeline"
        description="Where the role sits and how it pays."
        icon={MapPin}
      >
        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.05] bg-[#191a21] p-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#242338] text-[#8b81ff]">
              <Globe className="h-4 w-4" />
            </div>
            <div>
              <label
                htmlFor="isRemote"
                className="cursor-pointer text-sm font-medium text-white"
              >
                Remote work allowed
              </label>
              <p className="text-xs text-zinc-400">
                Enable worldwide or distributed candidate applications
              </p>
            </div>
          </div>

          <Switch
            id="isRemote"
            checked={formData.isRemote}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, isRemote: checked }))
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <TextField
            id="location"
            name="location"
            required
            requiredMark={false}
            hint="Required"
            label="Job location"
            icon={MapPin}
            placeholder="New York, USA"
            value={formData.location}
            onChange={handleChange}
          />

          <TextField
            id="deadline"
            name="deadline"
            type="date"
            label="Application deadline"
            className="[color-scheme:dark]"
            value={formData.deadline}
            onChange={handleChange}
          />

          <SelectField
            id="status"
            name="status"
            label="Listing status"
            options={["Active", "Expired"]}
            value={formData.status}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TextField
            id="minSalary"
            name="minSalary"
            type="number"
            min={0}
            label="Min salary / rate"
            placeholder="25"
            leading={
              <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-zinc-500">
                $
              </span>
            }
            value={formData.minSalary}
            onChange={handleChange}
          />

          <TextField
            id="maxSalary"
            name="maxSalary"
            type="number"
            min={0}
            label="Max salary / rate"
            placeholder="40"
            leading={
              <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-zinc-500">
                $
              </span>
            }
            value={formData.maxSalary}
            onChange={handleChange}
          />

          <SelectField
            id="frequency"
            name="frequency"
            label="Frequency"
            options={SALARY_FREQUENCIES}
            value={formData.frequency}
            onChange={handleChange}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Responsibilities & requirements"
        description="Be specific about the impact and the must-haves."
        icon={ArrowRight}
      >
        <TextareaField
          id="responsibilities"
          name="responsibilities"
          required
          rows={4}
          label="Key responsibilities"
          placeholder="Own the frontend architecture for our customer dashboard and ship polished, accessible interfaces…"
          value={formData.responsibilities}
          onChange={handleChange}
        />

        <TextareaField
          id="requirements"
          name="requirements"
          required
          rows={4}
          label="Qualifications & requirements"
          placeholder={
            "• 3+ years of experience with React, TypeScript, and modern state architectures\n• Solid understanding of DOM performance"
          }
          value={formData.requirements}
          onChange={handleChange}
        />
      </SectionCard>
    </form>
  )
}
