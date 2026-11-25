"use client"

import { useEffect, useState } from "react"
import {
  AtSign,
  BadgeCheck,
  Briefcase,
  Calendar,
  Edit3,
  Globe,
  Link2,
  MapPin,
  Save,
  Shield,
  User,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { SectionCard } from "@/components/shared/section-card"
import { toast } from "@/components/ui/toast"
import { useSavedJobs } from "@/hooks/use-saved-jobs"
import { authClient } from "@/lib/auth-client"
import { getInitials } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/types/auth"

const ROLE_META: Record<
  UserRole,
  { label: string; badge: string; accent: string; description: string }
> = {
  seeker: {
    label: "Job Seeker",
    badge: "🎯",
    accent: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
    description: "Actively looking for opportunities",
  },
  recruiter: {
    label: "Recruiter",
    badge: "🔍",
    accent: "border-[#5b4df5]/30 bg-[#5b4df5]/15 text-[#b7afff]",
    description: "Hiring talent for amazing companies",
  },
  admin: {
    label: "Administrator",
    badge: "🛡️",
    accent: "border-amber-500/25 bg-amber-500/10 text-amber-300",
    description: "Platform administrator & moderator",
  },
}

interface StatBadgeProps {
  label: string
  value: string | number
}

function StatBadge({ label, value }: StatBadgeProps) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-xl border border-white/[0.07] bg-[#0e0e13] px-5 py-3 text-center">
      <span className="text-xl font-bold text-white">{value}</span>
      <span className="text-[11px] font-medium text-zinc-500">{label}</span>
    </div>
  )
}

interface InfoRowProps {
  icon: React.ElementType
  label: string
  value: string
  href?: string
}

function InfoRow({ icon: Icon, label, value, href }: InfoRowProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-[#0e0e13]">
        <Icon className="h-3.5 w-3.5 text-zinc-500" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-600">
          {label}
        </p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-[13px] text-[#a99fff] transition-colors hover:text-white"
          >
            {value}
          </a>
        ) : (
          <p className="truncate text-[13px] text-zinc-200">{value}</p>
        )}
      </div>
    </div>
  )
}

export interface ProfileStats {
  applicationsCount?: number
  profileViewsCount?: number
  activeJobsCount?: number
  applicantsCount?: number
  hiredCount?: number
  usersCount?: number
  companiesCount?: number
  jobsCount?: number
}

interface UserProfileProps {
  role: UserRole
  initialStats?: ProfileStats
}

export function UserProfile({ role, initialStats }: UserProfileProps) {
  const { data: session } = authClient.useSession()
  const { savedJobs, isReady: isSavedReady } = useSavedJobs()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [displayName, setDisplayName] = useState("")

  const user = session?.user as
    | (NonNullable<typeof session>["user"] & {
        imageUrl?: string | null
        bio?: string | null
        location?: string | null
        website?: string | null
        twitter?: string | null
        linkedin?: string | null
      })
    | undefined

  const userImage = user?.imageUrl || user?.image
  const userName = user?.name || "Your name"
  const userEmail = user?.email || ""
  const initials = getInitials(userName, userEmail)
  const meta = ROLE_META[role]

  // Sync display name from session once it loads
  useEffect(() => {
    if (user?.name) setDisplayName(user.name)
  }, [user?.name])

  // Editable fields (bio/location/website etc stored locally; name saved via better-auth)
  const [form, setForm] = useState({
    bio: user?.bio || "",
    location: user?.location || "",
    website: user?.website || "",
    twitter: user?.twitter || "",
    linkedin: user?.linkedin || "",
  })

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Save display name via better-auth if it changed
      if (displayName.trim() && displayName.trim() !== user?.name) {
        const result = await authClient.updateUser({ name: displayName.trim() })
        if (result.error) throw new Error(result.error.message)
      }
      toast.add({ title: "Profile updated", description: "Your changes have been saved." })
      setIsEditing(false)
    } catch (err) {
      toast.add({
        title: "Failed to save profile",
        description: err instanceof Error ? err.message : "Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const stats: StatBadgeProps[] =
    role === "seeker"
      ? [
          {
            label: "Applications",
            value: initialStats?.applicationsCount ?? 0,
          },
          {
            label: "Saved jobs",
            value: isSavedReady ? savedJobs.length : "…",
          },
          {
            label: "Profile views",
            value: initialStats?.profileViewsCount ?? 0,
          },
        ]
      : role === "recruiter"
        ? [
            {
              label: "Active jobs",
              value: initialStats?.activeJobsCount ?? 0,
            },
            {
              label: "Applicants",
              value: initialStats?.applicantsCount ?? 0,
            },
            { label: "Hired", value: initialStats?.hiredCount ?? 0 },
          ]
        : [
            { label: "Users", value: initialStats?.usersCount ?? 0 },
            { label: "Companies", value: initialStats?.companiesCount ?? 0 },
            { label: "Jobs listed", value: initialStats?.jobsCount ?? 0 },
          ]

  return (
    <div className="space-y-6 pb-12">
      {/* Hero card */}
      <section className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101116]">
        {/* Gradient band */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-br from-[#5b4df5]/20 via-[#8b81ff]/10 to-transparent" />

        <div className="relative px-6 pb-6 pt-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-2 border-white/[0.12] bg-[#191a22] text-lg font-bold text-zinc-200 shadow-xl sm:h-24 sm:w-24">
                {userImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={userImage}
                    alt={userName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xl sm:text-2xl">{initials}</span>
                )}
              </div>
              <span className="absolute -right-1.5 -bottom-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-[#101116] text-sm">
                {meta.badge}
              </span>
            </div>

            {/* Name + role + stats */}
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold text-white sm:text-2xl">
                    {userName}
                  </h1>
                  <span
                    className={cn(
                      "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest",
                      meta.accent
                    )}
                  >
                    {meta.label}
                  </span>
                </div>
                <p className="mt-0.5 text-[13px] text-zinc-500">
                  {meta.description}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-[12px] text-zinc-600">
                  <AtSign className="h-3 w-3" />
                  {userEmail}
                </p>
              </div>

              <Button
                onClick={() =>
                  isEditing ? handleSave() : setIsEditing(true)
                }
                disabled={isSaving}
                className={cn(
                  "h-9 shrink-0 gap-2 rounded-xl px-4 text-[13px] font-medium",
                  isEditing
                    ? "border border-[#5b4df5]/40 bg-[#5b4df5]/20 text-[#c7c1ff] hover:bg-[#5b4df5]/30"
                    : "border border-white/[0.08] bg-[#14151b] text-zinc-200 hover:border-white/20 hover:text-white"
                )}
              >
                {isEditing ? (
                  <>
                    <Save className="h-3.5 w-3.5" />
                    {isSaving ? "Saving…" : "Save changes"}
                  </>
                ) : (
                  <>
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit profile
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-6 flex flex-wrap gap-3">
            {stats.map((s) => (
              <StatBadge key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* About */}
        <SectionCard
          title="About"
          description="A short bio visible on your public profile"
          icon={User}
          className="lg:col-span-2"
        >
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-[11px] font-medium uppercase tracking-widest text-zinc-500">
                  Display name
                </label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0e0e13] px-4 py-2.5 text-[13px] text-zinc-200 placeholder-zinc-600 outline-none focus:border-[#5b4df5]/50 focus:ring-2 focus:ring-[#5b4df5]/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium uppercase tracking-widest text-zinc-500">
                  Bio
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  placeholder="Write a short bio about yourself…"
                  rows={3}
                  className="w-full resize-none rounded-xl border border-white/[0.08] bg-[#0e0e13] px-4 py-3 text-[13px] text-zinc-200 placeholder-zinc-600 outline-none focus:border-[#5b4df5]/50 focus:ring-2 focus:ring-[#5b4df5]/20"
                />
              </div>
            </div>
          ) : (
            <p className="text-[13px] leading-relaxed text-zinc-400">
              {form.bio ||
                'No bio yet. Click Edit profile to add one.'}
            </p>
          )}
        </SectionCard>

        {/* Contact & links */}
        <SectionCard title="Info & links" icon={Link2}>
          <div className="space-y-3">
            {isEditing ? (
              <>
                {(
                  [
                    {
                      key: "location",
                      icon: MapPin,
                      placeholder: "City, Country",
                    },
                    {
                      key: "website",
                      icon: Globe,
                      placeholder: "https://yoursite.com",
                    },
                    {
                      key: "twitter",
                      icon: X,
                      placeholder: "@handle",
                    },
                    {
                      key: "linkedin",
                      icon: Link2,
                      placeholder: "linkedin.com/in/handle",
                    },
                  ] as const
                ).map(({ key, icon: Icon, placeholder }) => (
                  <div key={key} className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 shrink-0 text-zinc-600" />
                    <input
                      value={form[key]}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [key]: e.target.value }))
                      }
                      placeholder={placeholder}
                      className="min-w-0 flex-1 rounded-lg border border-white/[0.08] bg-[#0e0e13] px-3 py-1.5 text-[12.5px] text-zinc-200 placeholder-zinc-600 outline-none focus:border-[#5b4df5]/50"
                    />
                  </div>
                ))}
                <Button
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                  className="mt-1 h-8 w-full gap-1.5 rounded-lg border border-white/[0.06] text-[12px] text-zinc-500 hover:text-white"
                >
                  <X className="h-3 w-3" />
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <InfoRow icon={AtSign} label="Email" value={userEmail} />
                {form.location && (
                  <InfoRow
                    icon={MapPin}
                    label="Location"
                    value={form.location}
                  />
                )}
                {form.website && (
                  <InfoRow
                    icon={Globe}
                    label="Website"
                    value={form.website}
                    href={form.website}
                  />
                )}
                {form.twitter && (
                  <InfoRow
                    icon={X}
                    label="Twitter"
                    value={form.twitter}
                    href={`https://twitter.com/${form.twitter.replace("@", "")}`}
                  />
                )}
                {form.linkedin && (
                  <InfoRow
                    icon={Link2}
                    label="LinkedIn"
                    value={form.linkedin}
                    href={
                      form.linkedin.startsWith("http")
                        ? form.linkedin
                        : `https://${form.linkedin}`
                    }
                  />
                )}
                {!form.location &&
                  !form.website &&
                  !form.twitter &&
                  !form.linkedin && (
                    <p className="text-[12px] text-zinc-600">
                      No links added yet.
                    </p>
                  )}
              </>
            )}
          </div>
        </SectionCard>
      </div>

      {/* Role-specific card */}
      <SectionCard
        title={
          role === "seeker"
            ? "Career profile"
            : role === "recruiter"
              ? "Recruiter details"
              : "Admin access"
        }
        description={
          role === "seeker"
            ? "Highlights shown to recruiters on your applications"
            : role === "recruiter"
              ? "Information displayed on your job postings"
              : "Your platform-level permissions and audit identity"
        }
        icon={
          role === "seeker"
            ? Briefcase
            : role === "recruiter"
              ? Briefcase
              : Shield
        }
      >
        {role === "admin" ? (
          <div className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
            <BadgeCheck className="h-5 w-5 shrink-0 text-amber-400" />
            <div>
              <p className="text-[13px] font-semibold text-amber-200">
                Full platform access
              </p>
              <p className="text-[11px] text-amber-400/60">
                You have administrator privileges on HireLoop.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                label:
                  role === "seeker" ? "Open to work" : "Actively recruiting",
                value: "Yes",
                icon: BadgeCheck,
              },
              {
                label: "Member since",
                value: user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  : "—",
                icon: Calendar,
              },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#0e0e13] px-4 py-3"
              >
                <Icon className="h-4 w-4 shrink-0 text-[#a99fff]" />
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-600">
                    {label}
                  </p>
                  <p className="text-[13px] font-semibold text-white">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  )
}
