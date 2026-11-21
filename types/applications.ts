export type ApplicationStatus =
    | "Applied"
    | "Pending"
    | "Review"
    | "Under Review"
    | "Shortlisted"
    | "Interview"
    | "Offered"
    | "Rejected"

export interface JobApplicationPayload {
    jobId: string
    userId: string
    applicantName: string
    applicantEmail: string
    jobTitle: string
    companyName: string
    location: string
    isRemote: boolean
    jobType: string
    minSalary?: number
    maxSalary?: number
    status: ApplicationStatus
    appliedAt: string
    archived?: boolean
}

export interface ManagedApplication extends JobApplicationPayload {
    _id: string
}