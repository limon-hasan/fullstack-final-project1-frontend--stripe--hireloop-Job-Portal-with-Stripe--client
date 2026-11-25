"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Building2,
  Globe,
  MapPin,
  Save,
  Users,
  Wand2,
} from "lucide-react"

import { BrandButton } from "@/components/shared/brand-button"
import { SectionCard } from "@/components/shared/section-card"
import { toast } from "@/components/ui/toast"
import { STORAGE_KEYS, readStorage, writeStorage } from "@/lib/storage"

export interface CompanyProfile {
  name: string
  website: string
  industry: string
  size: string
  location: string
  founded: string
  tagline: string
  about: string
}

const EMPTY_PROFILE: CompanyProfile = {
  name: "",
  website: "",
  industry: "",
  size: "1-10",
  location: "",
  founded: "",
  tagline: "",
  about: "",
}

const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "500+"]

const INDUSTRIES = [
  "Engineering & Tech",
  "Design & Creative",
  "Data & Analytics",
  "Marketing & Sales",
  "Product & Management",
  "Other",
]

interface CompanyProfileFormProps {
  defaultName?: string
}

export function CompanyProfileForm({ defaultName }: CompanyProfileFormProps) {
  const [profile, setProfile] = useState<CompanyProfile>(EMPTY_PROFILE)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const stored = readStorage<Partial<CompanyProfile>>(
      STORAGE_KEYS.companyProfile,
      {}
    )
    setProfile({
      ...EMPTY_PROFILE,
      ...(defaultName ? { name: defaultName } : {}),
      ...stored,
    })
    setIsReady(true)
  }, [defaultName])

  const update = (key: keyof CompanyProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }))
  }

  const completion = Math.round(
    (Object.values(profile).filter((value) => value.trim().length > 0).length /
      Object.keys(profile).length) *
    100
  )

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (!profile.name.trim()) {
      toast.add({
        title: "Company name required",
        description: "Add your company name so candidates can recognise you.",
      })
      return
    }

    writeStorage(STORAGE_KEYS.companyProfile, profile)
    toast.add({
      title: "Company profile saved",
      description: "Your public profile has been updated on this device.",
    })
  }

  const initial = (profile.name || "H").charAt(0).toUpperCase()

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 xl:grid-cols-3">
      <div className="space-y-5 xl:col-span-2">
        <SectionCard
          title="Company details"
          description="Basic information candidates see on your job posts."
          icon={Building2}
          action={
            <BrandButton type="submit" className="h-9 px-4 text-[12.5px]">
              <Save className="mr-2 h-3.5 w-3.5" />
              Save profile
            </BrandButton>
          }
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-2 sm:col-span-2">
              <span className="text-[11.5px] font-medium text-zinc-400">
                Company name
              </span>
              <div className="relative">
                <Building2 className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  value={profile.name}
                  onChange={(event) => update("name", event.target.value)}
                  placeholder="Acme Labs"
                  className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0d0e12] pr-3 pl-9 text-[13px] text-white placeholder-zinc-500 transition-colors focus:border-[#5b4df5]/50 focus:outline-none"
                />
              </div>
            </label>

            <label className="space-y-2">
              <span className="text-[11.5px] font-medium text-zinc-400">
                Website
              </span>
              <div className="relative">
                <Globe className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  value={profile.website}
                  onChange={(event) => update("website", event.target.value)}
                  placeholder="https://acme.com"
                  className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0d0e12] pr-3 pl-9 text-[13px] text-white placeholder-zinc-500 transition-colors focus:border-[#5b4df5]/50 focus:outline-none"
                />
              </div>
            </label>

            <label className="space-y-2">
              <span className="text-[11.5px] font-medium text-zinc-400">
                Headquarters
              </span>
              <div className="relative">
                <MapPin className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  value={profile.location}
                  onChange={(event) => update("location", event.target.value)}
                  placeholder="Berlin, Germany"
                  className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0d0e12] pr-3 pl-9 text-[13px] text-white placeholder-zinc-500 transition-colors focus:border-[#5b4df5]/50 focus:outline-none"
                />
              </div>
            </label>

            <label className="space-y-2">
              <span className="text-[11.5px] font-medium text-zinc-400">
                Industry
              </span>
              <select
                value={profile.industry}
                onChange={(event) => update("industry", event.target.value)}
                className="h-11 w-full cursor-pointer rounded-xl border border-white/[0.08] bg-[#0d0e12] px-3 text-[13px] text-white transition-colors focus:border-[#5b4df5]/50 focus:outline-none"
              >
                <option value="">Select industry</option>
                {INDUSTRIES.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-[11.5px] font-medium text-zinc-400">
                Company size
              </span>
              <select
                value={profile.size}
                onChange={(event) => update("size", event.target.value)}
                className="h-11 w-full cursor-pointer rounded-xl border border-white/[0.08] bg-[#0d0e12] px-3 text-[13px] text-white transition-colors focus:border-[#5b4df5]/50 focus:outline-none"
              >
                {COMPANY_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size} employees
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-[11.5px] font-medium text-zinc-400">
                Founded
              </span>
              <input
                value={profile.founded}
                onChange={(event) => update("founded", event.target.value)}
                inputMode="numeric"
                placeholder="2019"
                className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0d0e12] px-3 text-[13px] text-white placeholder-zinc-500 transition-colors focus:border-[#5b4df5]/50 focus:outline-none"
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-[11.5px] font-medium text-zinc-400">
              Tagline
            </span>
            <input
              value={profile.tagline}
              onChange={(event) => update("tagline", event.target.value)}
              placeholder="Hiring tools for teams that move fast"
              className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0d0e12] px-3 text-[13px] text-white placeholder-zinc-500 transition-colors focus:border-[#5b4df5]/50 focus:outline-none"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-[11.5px] font-medium text-zinc-400">
              About the company
            </span>
            <textarea
              value={profile.about}
              onChange={(event) => update("about", event.target.value)}
              rows={5}
              placeholder="Describe your mission, products and the kind of people you hire…"
              className="w-full resize-y rounded-xl border border-white/[0.08] bg-[#0d0e12] px-3 py-2.5 text-[13px] leading-relaxed text-white placeholder-zinc-500 transition-colors focus:border-[#5b4df5]/50 focus:outline-none"
            />
            <span className="block text-right text-[10.5px] text-zinc-600">
              {profile.about.length} characters
            </span>
          </label>
        </SectionCard>

        <SectionCard
          title="Hiring preferences"
          description="Defaults applied when you create a new listing."
          icon={Wand2}
          contentClassName="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-[11.5px] font-medium text-zinc-400">
                Default company name
              </span>
              <input
                value={profile.name}
                onChange={(event) => update("name", event.target.value)}
                placeholder="Acme Labs"
                className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0d0e12] px-3 text-[13px] text-white placeholder-zinc-500 transition-colors focus:border-[#5b4df5]/50 focus:outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-[11.5px] font-medium text-zinc-400">
                Default location
              </span>
              <input
                value={profile.location}
                onChange={(event) => update("location", event.target.value)}
                placeholder="Berlin, Germany"
                className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0d0e12] px-3 text-[13px] text-white placeholder-zinc-500 transition-colors focus:border-[#5b4df5]/50 focus:outline-none"
              />
            </label>
          </div>

          <p className="text-[11px] leading-relaxed text-zinc-500">
            These values are stored in this browser. Use{" "}
            <Link
              href="/dashboard/recruiter/jobs/new"
              className="font-medium text-[#a99fff] hover:text-white"
            >
              Post a job
            </Link>{" "}
            to enter full listing details.
          </p>
        </SectionCard>
      </div>

      <div className="space-y-5">
        <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101116]">
          <div className="relative h-24 bg-[linear-gradient(135deg,#e0e7ff,#f8fafc_60%)] dark:bg-[linear-gradient(135deg,#241f5c,#101116_60%)]">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(139,129,255,0.25),transparent_55%)]"
            />
          </div>
          <div className="px-5 pb-5">
            <div className="-mt-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.1] bg-[#15161d] text-xl font-semibold text-[#c7c1ff]">
              {initial}
            </div>
            <h3 className="mt-3 text-base font-semibold text-white">
              {profile.name || "Your company"}
            </h3>
            <p className="mt-0.5 text-[12px] text-zinc-500">
              {profile.tagline || "Add a tagline to stand out"}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {profile.industry && (
                <span className="rounded-full border border-white/[0.07] bg-[#15161d] px-2.5 py-1 text-[10.5px] font-medium text-zinc-300">
                  {profile.industry}
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded-full border border-white/[0.07] bg-[#15161d] px-2.5 py-1 text-[10.5px] font-medium text-zinc-300">
                <Users className="h-2.5 w-2.5" />
                {profile.size}
              </span>
              {profile.location && (
                <span className="inline-flex items-center gap-1 rounded-full border border-white/[0.07] bg-[#15161d] px-2.5 py-1 text-[10.5px] font-medium text-zinc-300">
                  <MapPin className="h-2.5 w-2.5" />
                  {profile.location}
                </span>
              )}
            </div>

            <p className="mt-4 line-clamp-4 text-[12px] leading-relaxed text-zinc-500">
              {profile.about ||
                "Tell candidates what you build, how you work and why they should join."}
            </p>

            {profile.website && (
              <p className="mt-3 truncate text-[11.5px] font-medium text-[#a99fff]">
                {profile.website}
              </p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-white/[0.07] bg-[#101116] p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">
              Profile completeness
            </h2>
            <span className="text-xs font-medium text-zinc-400">
              {isReady ? completion : 0}%
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#5b4df5,#8b81ff)] transition-all"
              style={{ width: `${isReady ? completion : 0}%` }}
            />
          </div>
          <p className="mt-3 text-[11.5px] leading-relaxed text-zinc-500">
            Profiles with a logo, tagline and about section get up to 3× more
            qualified applicants.
          </p>
        </section>
      </div>
    </form>
  )
}
