import { Hero } from "@/components/Hero"
import {
  BenefitsSplit,
  CategoryShowcase,
  CtaBand,
  FeaturedJobs,
  HowItWorks,
  Testimonials,
  TrustedBy,
} from "@/components/home/marketing-sections"
import { getJobs } from "@/lib/api/jobs"

export default async function Page() {
  const jobs = await getJobs()

  return (
    <div className="flex min-h-svh flex-col bg-[#08080a]">
      <main className="flex-1">
        <Hero jobs={jobs} />
        <TrustedBy />
        <FeaturedJobs jobs={jobs} />
        <CategoryShowcase jobs={jobs} />
        <HowItWorks />
        <BenefitsSplit />
        <Testimonials />
        <CtaBand />
      </main>
    </div>
  )
}
