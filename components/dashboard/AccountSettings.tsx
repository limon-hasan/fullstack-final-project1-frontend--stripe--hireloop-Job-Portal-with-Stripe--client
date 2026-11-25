"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  BellRing,
  Download,
  KeyRound,
  LogOut,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { SectionCard } from "@/components/shared/section-card"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"
import { getInitials } from "@/lib/format"
import { STORAGE_KEYS, readStorage, writeStorage } from "@/lib/storage"

type NotificationPreferences = {
  applicationUpdates: boolean
  jobAlerts: boolean
  productNews: boolean
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  applicationUpdates: true,
  jobAlerts: true,
  productNews: false,
}

const ROLE_LABELS: Record<string, string> = {
  seeker: "Job seeker",
  recruiter: "Recruiter",
  admin: "Administrator",
}

interface AccountSettingsProps {
  role: string
}

export function AccountSettings({ role }: AccountSettingsProps) {
  const router = useRouter()
  const { data: session } = authClient.useSession()

  const user = session?.user as
    | (NonNullable<typeof session>["user"] & { imageUrl?: string | null })
    | undefined
  const userImage = user?.imageUrl || user?.image

  const [name, setName] = useState("")
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [preferences, setPreferences] =
    useState<NotificationPreferences>(DEFAULT_PREFERENCES)
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  })
  const [isSavingPassword, setIsSavingPassword] = useState(false)

  useEffect(() => {
    setName(user?.name ?? "")
  }, [user?.name])

  useEffect(() => {
    const stored = readStorage<Partial<NotificationPreferences>>(
      "hireloop.notifications",
      {}
    )
    setPreferences({ ...DEFAULT_PREFERENCES, ...stored })
  }, [])

  const updatePreference = (
    key: keyof NotificationPreferences,
    value: boolean
  ) => {
    const next = { ...preferences, [key]: value }
    setPreferences(next)
    writeStorage("hireloop.notifications", next)
  }

  const handleSaveProfile = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!name.trim()) {
      toast.add({
        title: "Name is required",
        description: "Add a display name so recruiters know who you are.",
      })
      return
    }

    setIsSavingProfile(true)
    try {
      const result = await authClient.updateUser({ name: name.trim() })
      if (result.error) {
        throw new Error(result.error.message || "Could not update profile")
      }
      toast.add({
        title: "Profile updated",
        description: "Your display name has been saved.",
      })
      router.refresh()
    } catch (error) {
      toast.add({
        title: "Update failed",
        description:
          error instanceof Error ? error.message : "Please try again.",
      })
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault()
    if (passwords.newPassword.length < 8) {
      toast.add({
        title: "Password too short",
        description: "Use at least 8 characters for your new password.",
      })
      return
    }

    setIsSavingPassword(true)
    try {
      const result = await authClient.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
        revokeOtherSessions: true,
      })
      if (result.error) {
        throw new Error(result.error.message || "Could not change password")
      }
      setPasswords({ currentPassword: "", newPassword: "" })
      toast.add({
        title: "Password changed",
        description: "Other sessions have been signed out.",
      })
    } catch (error) {
      toast.add({
        title: "Could not change password",
        description:
          error instanceof Error ? error.message : "Please try again.",
      })
    } finally {
      setIsSavingPassword(false)
    }
  }

  const handleExport = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      account: {
        name: user?.name ?? "",
        email: user?.email ?? "",
        role,
      },
      savedJobs: readStorage(STORAGE_KEYS.savedJobs, []),
      notificationPreferences: preferences,
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "hireloop-account.json"
    link.click()
    URL.revokeObjectURL(url)

    toast.add({
      title: "Export ready",
      description: "Your account data has been downloaded.",
    })
  }

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <div className="space-y-5">
      <SectionCard
        title="Profile"
        description="How you appear across HireLoop."
        icon={UserRound}
        contentClassName="space-y-5"
      >
        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-[#191a22] text-sm font-semibold text-zinc-200">
              {userImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={userImage}
                  alt={name || "Profile avatar"}
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(name, user?.email)
              )}
            </div>
            <div>
              <p className="text-[13px] font-medium text-white">
                {name || "Your account"}
              </p>
              <p className="text-[11.5px] text-zinc-500">
                {ROLE_LABELS[role] ?? role} ·{" "}
                {user?.emailVerified ? "Email verified" : "Email unverified"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-[11.5px] font-medium text-zinc-400">
                Display name
              </span>
              <div className="relative">
                <UserRound className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0d0e12] pr-3 pl-9 text-[13px] text-white placeholder-zinc-500 transition-colors focus:border-[#5b4df5]/50 focus:outline-none"
                />
              </div>
            </label>

            <label className="space-y-2">
              <span className="text-[11.5px] font-medium text-zinc-400">
                Email address
              </span>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  value={user?.email ?? ""}
                  readOnly
                  className="h-11 w-full cursor-not-allowed rounded-xl border border-white/[0.05] bg-[#0b0c10] pr-3 pl-9 text-[13px] text-zinc-400"
                />
              </div>
            </label>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500">
              <ShieldCheck className="h-3.5 w-3.5" />
              Managed securely by Better Auth
            </span>
            <Button
              type="submit"
              disabled={isSavingProfile}
              className="h-10 rounded-xl bg-[#5b4df5] px-4 text-[13px] font-medium text-white hover:bg-[#6a5cff]"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSavingProfile ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      </SectionCard>

      <SectionCard
        title="Notifications"
        description="Choose what lands in your inbox."
        icon={BellRing}
        contentClassName="space-y-0 p-0"
      >
        <div className="divide-y divide-white/[0.05]">
          {(
            [
              {
                key: "applicationUpdates",
                title: "Application updates",
                description:
                  "Status changes, interview invites and recruiter replies.",
              },
              {
                key: "jobAlerts",
                title: "Job alerts",
                description: "New roles that match the categories you follow.",
              },
              {
                key: "productNews",
                title: "Product news",
                description: "Occasional emails about new HireLoop features.",
              },
            ] as const
          ).map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4 px-6 py-4"
            >
              <div>
                <p className="text-[13px] font-medium text-white">
                  {item.title}
                </p>
                <p className="mt-0.5 text-[11.5px] text-zinc-500">
                  {item.description}
                </p>
              </div>
              <Switch
                checked={preferences[item.key]}
                onCheckedChange={(checked) =>
                  updatePreference(item.key, checked)
                }
                aria-label={item.title}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Password"
        description="Update the password used to sign in."
        icon={KeyRound}
        contentClassName="space-y-4"
      >
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-[11.5px] font-medium text-zinc-400">
                Current password
              </span>
              <input
                type="password"
                autoComplete="current-password"
                value={passwords.currentPassword}
                onChange={(event) =>
                  setPasswords((prev) => ({
                    ...prev,
                    currentPassword: event.target.value,
                  }))
                }
                placeholder="••••••••"
                className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0d0e12] px-3 text-[13px] text-white placeholder-zinc-600 transition-colors focus:border-[#5b4df5]/50 focus:outline-none"
              />
            </label>

            <label className="space-y-2">
              <span className="text-[11.5px] font-medium text-zinc-400">
                New password
              </span>
              <input
                type="password"
                autoComplete="new-password"
                value={passwords.newPassword}
                onChange={(event) =>
                  setPasswords((prev) => ({
                    ...prev,
                    newPassword: event.target.value,
                  }))
                }
                placeholder="At least 8 characters"
                className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0d0e12] px-3 text-[13px] text-white placeholder-zinc-600 transition-colors focus:border-[#5b4df5]/50 focus:outline-none"
              />
            </label>
          </div>

          <div className="flex justify-end border-t border-white/[0.06] pt-4">
            <Button
              type="submit"
              variant="outline"
              disabled={isSavingPassword}
              className="h-10 rounded-xl border-white/[0.12] bg-transparent px-4 text-[13px] font-medium text-zinc-200 hover:bg-white/[0.05] hover:text-white"
            >
              {isSavingPassword ? "Updating…" : "Update password"}
            </Button>
          </div>
        </form>
      </SectionCard>

      <SectionCard
        title="Sessions & data"
        description="Control access to your account and take your data with you."
        icon={ShieldCheck}
        contentClassName="space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-[#0d0e12] px-4 py-3">
          <div>
            <p className="text-[13px] font-medium text-white">
              Export account data
            </p>
            <p className="mt-0.5 text-[11.5px] text-zinc-500">
              Downloads a JSON snapshot of your profile and saved jobs.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-white/[0.08] bg-[#15161d] px-3 text-[12.5px] font-medium text-zinc-200 transition-colors hover:border-white/20 hover:text-white"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-500/15 bg-rose-500/[0.05] px-4 py-3">
          <div>
            <p className="text-[13px] font-medium text-white">Sign out</p>
            <p className="mt-0.5 text-[11.5px] text-zinc-500">
              End this session on the current device.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-rose-500/25 bg-rose-500/10 px-3 text-[12.5px] font-medium text-rose-300 transition-colors hover:bg-rose-500/15"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </SectionCard>
    </div>
  )
}
