"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Building2, Globe, MapPin } from "lucide-react"

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
import { createJob } from "@/lib/actions/jobs"
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
  SalaryFrequency,
} from "@/types/jobs"

// Keep the old page-level type import path working.
export type { JobPayload } from "@/types/jobs"

export default function NewJobsPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    category: "Engineering & Tech" as JobCategory,
    jobType: "Full-time" as JobType,
    isRemote: false,
    location: "",
    deadline: "",
    minSalary: "",
    maxSalary: "",
    frequency: "per hour" as SalaryFrequency,
    responsibilities: "",
    requirements: "",
    applicantsCount: 0,
    status: "Active" as JobStatus,
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const jobPayload: JobPayload = {
      ...formData,
      minSalary: Number(formData.minSalary) || 0,
      maxSalary: Number(formData.maxSalary) || 0,
    }

    const result = await createJob(jobPayload)
    if (result.insertedId) {
      toast.add({
        title: "Job created",
        description: "The job has been added successfully",
      })
      router.push("/dashboard/recruiter/jobs")
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6 pb-12 text-white">
      <PageHeader
        breadcrumbs={[
          { label: "Manage Jobs", href: "/dashboard/recruiter/jobs" },
          { label: "Create New Listing" },
        ]}
        title="Post a New Job"
        description="Fill in the position specifications to attract qualified talent across our network."
        action={
          <BrandButton type="submit" className="shrink-0 px-6">
            Publish Job
            <ArrowRight className="ml-2 h-4 w-4" />
          </BrandButton>
        }
      />

      <SectionCard title="1. Basic Information">
        <TextField
          id="title"
          name="title"
          required
          label="Job Title"
          placeholder="Frontend Developer"
          value={formData.title}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextField
            id="companyName"
            name="companyName"
            required
            label="Company Name"
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
                Job Category <span className="text-[#7c73f8]">*</span>
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
              Job Type <span className="text-[#7c73f8]">*</span>
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
                  className={`h-11 rounded-xl border text-sm font-medium transition-all ${
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

      <SectionCard title="2. Location, Compensation & Timeline">
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
                Remote Work Allowed (isRemote)
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextField
            id="location"
            name="location"
            required
            requiredMark={false}
            hint="Required"
            label="Job Location (location)"
            icon={MapPin}
            placeholder="New York, USA"
            value={formData.location}
            onChange={handleChange}
          />

          <TextField
            id="deadline"
            name="deadline"
            type="date"
            label="Application Deadline (deadline)"
            className="[color-scheme:dark]"
            value={formData.deadline}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TextField
            id="minSalary"
            name="minSalary"
            type="number"
            min={0}
            label="Min Salary / Rate"
            placeholder="25"
            leading={
              <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-zinc-500">
                €
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
            label="Max Salary / Rate"
            placeholder="40"
            leading={
              <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-zinc-500">
                €
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

      <SectionCard title="3. Responsibilities & Requirements">
        <TextareaField
          id="responsibilities"
          name="responsibilities"
          required
          rows={4}
          label="Key Responsibilities"
          placeholder="Showcase your commitment to delivering exceptional user interfaces and digital experiences..."
          value={formData.responsibilities}
          onChange={handleChange}
        />

        <TextareaField
          id="requirements"
          name="requirements"
          required
          rows={4}
          label="Qualifications & Requirements"
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
