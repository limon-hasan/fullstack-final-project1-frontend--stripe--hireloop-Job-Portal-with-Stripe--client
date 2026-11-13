"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Building2,
  ChevronRight,
  Globe,
  MapPin,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { createJob } from "@/lib/actions/jobs"
import { redirect } from "next/navigation"
import { toast } from "@/components/ui/toast"

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"] as const

const JOB_CATEGORIES = [
  "Engineering & Tech",
  "Design & Creative",
  "Product Management",
  "Data & AI",
  "Marketing & Sales",
]

const SALARY_FREQUENCIES = ["per hour", "per month", "per year"]

export interface JobPayload {
  title: string
  companyName: string
  category: string
  jobType: string
  isRemote: boolean
  location: string
  deadline: string
  minSalary: number
  maxSalary: number
  frequency: string
  responsibilities: string
  requirements: string
  applicantsCount: number
  status: "Active" | "Expired"
}

export default function NewJobsPage() {
  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
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
    applicantsCount: 0,
    status: "Active" as "Active" | "Expired",
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

    console.log("Collected Job Data:", jobPayload)

    const result = await createJob(jobPayload)
    if (result.insertedId) {
      toast.add({
        title: "Job created",
        description: `The job has been addedd sucessfully`,
      })
      console.log("Create job result : ", result)
      redirect(`/dashboard/recruiter/jobs`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6 pb-12 text-white">
      {/* Breadcrumb & Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-zinc-400">
            <Link
              href="/dashboard/recruiter/jobs"
              className="transition-colors hover:text-white"
            >
              Manage Jobs
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
            <span className="text-[#7c73f8]">Create New Listing</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Post a New Job
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Fill in the position specifications to attract qualified talent
            across our network.
          </p>
        </div>

        <Button
          type="submit"
          className="h-11 shrink-0 rounded-xl bg-[#5b4df5] px-6 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(91,77,245,0.85)] hover:bg-[#6c5ff7]"
        >
          Publish Job
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Section 1: Basic Information */}
      <section className="space-y-5 rounded-2xl border border-white/[0.07] bg-[#121318] p-6">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-[#5b4df5]" />
          <h2 className="text-base font-semibold text-white">
            1. Basic Information
          </h2>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title" className="text-xs font-medium text-zinc-300">
            Job Title <span className="text-[#7c73f8]">*</span>
          </Label>
          <Input
            id="title"
            name="title"
            required
            placeholder="Frontend Developer"
            value={formData.title}
            onChange={handleChange}
            className="h-11 rounded-xl border-white/[0.06] bg-[#191a21] text-sm text-white placeholder:text-zinc-500 focus-visible:border-[#5b4df5] focus-visible:ring-[#5b4df5]/25"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="companyName"
              className="text-xs font-medium text-zinc-300"
            >
              Company Name <span className="text-[#7c73f8]">*</span>
            </Label>
            <div className="relative">
              <Building2 className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                id="companyName"
                name="companyName"
                required
                placeholder="HirePulse Network"
                value={formData.companyName}
                onChange={handleChange}
                className="h-11 rounded-xl border-white/[0.06] bg-[#191a21] pl-10 text-sm text-white placeholder:text-zinc-500 focus-visible:border-[#5b4df5] focus-visible:ring-[#5b4df5]/25"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="category"
              className="text-xs font-medium text-zinc-300"
            >
              Job Category <span className="text-[#7c73f8]">*</span>
            </Label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-white/[0.06] bg-[#191a21] px-3.5 text-sm text-white transition-colors outline-none focus:border-[#5b4df5]"
            >
              {JOB_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-[#191a21]">
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium text-zinc-300">
            Job Type <span className="text-[#7c73f8]">*</span>
          </Label>
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
        </div>
      </section>

      {/* Section 2: Location, Compensation & Timeline */}
      <section className="space-y-5 rounded-2xl border border-white/[0.07] bg-[#121318] p-6">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-[#5b4df5]" />
          <h2 className="text-base font-semibold text-white">
            2. Location, Compensation & Timeline
          </h2>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.05] bg-[#191a21] p-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#242338] text-[#8b81ff]">
              <Globe className="h-4 w-4" />
            </div>
            <div>
              <Label
                htmlFor="isRemote"
                className="cursor-pointer text-sm font-medium text-white"
              >
                Remote Work Allowed (isRemote)
              </Label>
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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="location"
                className="text-xs font-medium text-zinc-300"
              >
                Job Location (location)
              </Label>
              <span className="text-[11px] text-zinc-500">Required</span>
            </div>
            <div className="relative">
              <MapPin className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                id="location"
                name="location"
                required
                placeholder="New York, USA"
                value={formData.location}
                onChange={handleChange}
                className="h-11 rounded-xl border-white/[0.06] bg-[#191a21] pl-10 text-sm text-white placeholder:text-zinc-500 focus-visible:border-[#5b4df5] focus-visible:ring-[#5b4df5]/25"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="deadline"
              className="text-xs font-medium text-zinc-300"
            >
              Application Deadline (deadline)
            </Label>
            <Input
              id="deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              className="h-11 rounded-xl border-white/[0.06] bg-[#191a21] text-sm text-white [color-scheme:dark] focus-visible:border-[#5b4df5] focus-visible:ring-[#5b4df5]/25"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label
              htmlFor="minSalary"
              className="text-xs font-medium text-zinc-300"
            >
              Min Salary / Rate
            </Label>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-zinc-500">
                €
              </span>
              <Input
                id="minSalary"
                name="minSalary"
                type="number"
                min={0}
                placeholder="25"
                value={formData.minSalary}
                onChange={handleChange}
                className="h-11 rounded-xl border-white/[0.06] bg-[#191a21] pl-8 text-sm text-white placeholder:text-zinc-500 focus-visible:border-[#5b4df5] focus-visible:ring-[#5b4df5]/25"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="maxSalary"
              className="text-xs font-medium text-zinc-300"
            >
              Max Salary / Rate
            </Label>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-zinc-500">
                €
              </span>
              <Input
                id="maxSalary"
                name="maxSalary"
                type="number"
                min={0}
                placeholder="40"
                value={formData.maxSalary}
                onChange={handleChange}
                className="h-11 rounded-xl border-white/[0.06] bg-[#191a21] pl-8 text-sm text-white placeholder:text-zinc-500 focus-visible:border-[#5b4df5] focus-visible:ring-[#5b4df5]/25"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="frequency"
              className="text-xs font-medium text-zinc-300"
            >
              Frequency
            </Label>
            <select
              id="frequency"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-white/[0.06] bg-[#191a21] px-3.5 text-sm text-white transition-colors outline-none focus:border-[#5b4df5]"
            >
              {SALARY_FREQUENCIES.map((freq) => (
                <option key={freq} value={freq} className="bg-[#191a21]">
                  {freq}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Section 3: Responsibilities & Requirements */}
      <section className="space-y-5 rounded-2xl border border-white/[0.07] bg-[#121318] p-6">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-[#5b4df5]" />
          <h2 className="text-base font-semibold text-white">
            3. Responsibilities & Requirements
          </h2>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="responsibilities"
            className="text-xs font-medium text-zinc-300"
          >
            Key Responsibilities <span className="text-[#7c73f8]">*</span>
          </Label>
          <Textarea
            id="responsibilities"
            name="responsibilities"
            required
            rows={4}
            placeholder="Showcase your commitment to delivering exceptional user interfaces and digital experiences..."
            value={formData.responsibilities}
            onChange={handleChange}
            className="rounded-xl border-white/[0.06] bg-[#191a21] p-3.5 text-sm text-white placeholder:text-zinc-500 focus-visible:border-[#5b4df5] focus-visible:ring-[#5b4df5]/25"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="requirements"
            className="text-xs font-medium text-zinc-300"
          >
            Qualifications & Requirements{" "}
            <span className="text-[#7c73f8]">*</span>
          </Label>
          <Textarea
            id="requirements"
            name="requirements"
            required
            rows={4}
            placeholder={
              "• 3+ years of experience with React, TypeScript, and modern state architectures\n• Solid understanding of DOM performance"
            }
            value={formData.requirements}
            onChange={handleChange}
            className="rounded-xl border-white/[0.06] bg-[#191a21] p-3.5 text-sm text-white placeholder:text-zinc-500 focus-visible:border-[#5b4df5] focus-visible:ring-[#5b4df5]/25"
          />
        </div>
      </section>
    </form>
  )
}
