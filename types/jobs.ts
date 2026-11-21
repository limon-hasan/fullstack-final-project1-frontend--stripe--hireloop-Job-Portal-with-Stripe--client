import type {
  JOB_CATEGORIES,
  JOB_TYPES,
  SALARY_FREQUENCIES,
} from "@/lib/constants/jobs"

export type JobType = (typeof JOB_TYPES)[number]
export type JobCategory = (typeof JOB_CATEGORIES)[number]
export type SalaryFrequency = (typeof SALARY_FREQUENCIES)[number]
export type JobStatus = "Active" | "Expired"

export interface JobPayload {
  title: string
  companyName: string
  companyId?: string
  recruiterId: string
  category: JobCategory
  jobType: JobType
  isRemote: boolean
  location: string
  deadline: string
  minSalary: number
  maxSalary: number
  frequency: SalaryFrequency
  responsibilities: string
  requirements: string
  applicantsCount: number
  status: JobStatus
}

export interface ManagedJob extends JobPayload {
  _id: string
  postedLabel: string
}
