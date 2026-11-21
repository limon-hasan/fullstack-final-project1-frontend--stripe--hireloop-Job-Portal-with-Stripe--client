import { Briefcase, Shield, UserCheck, Users } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import type { AdminUser, UserRole } from "@/types/users"
import { UsersTable } from "./_components/users-table"
import { getUsers } from "@/lib/api/users"
function normalizeRole(role?: string | null): UserRole {
  if (role === "admin" || role === "recruiter" || role === "seeker") {
    return role
  }
  return "seeker"
}

export default async function AdminUsersPage() {
  const response = await getUsers()
  const rawUsers = Array.isArray(response) ? response : (response?.users ?? [])

  const users: AdminUser[] = rawUsers.map((user) => ({
    id: String(user._id),
    name: user.name ?? "",
    email: user.email ?? "",
    image: user.image ?? null,
    role: normalizeRole(user.role),
    emailVerified: Boolean(user.emailVerified),
    banned: Boolean(user.banned),
    banReason: user.banReason ?? null,
    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : "",
  }))

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      icon: Users,
      iconClass: "text-indigo-400",
    },
    {
      label: "Admins",
      value: users.filter((u) => u.role === "admin").length,
      icon: Shield,
      iconClass: "text-purple-400",
    },
    {
      label: "Recruiters",
      value: users.filter((u) => u.role === "recruiter").length,
      icon: Briefcase,
      iconClass: "text-sky-400",
    },
    {
      label: "Job Seekers",
      value: users.filter((u) => u.role === "seeker").length,
      icon: UserCheck,
      iconClass: "text-emerald-400",
    },
  ]

  return (
    <div className="w-full space-y-6 pb-12 text-white">
      <PageHeader
        breadcrumbs={[{ label: "Admin" }, { label: "Users Management" }]}
        title="Users Management"
        description="Monitor registered accounts, review verification status, and manage user roles across the platform."
      />

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, iconClass }) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-2xl border border-white/[0.07] bg-[#121318] px-5 py-4"
          >
            <div>
              <p className="text-xs font-medium text-zinc-400">{label}</p>
              <p className="mt-1 text-2xl font-bold text-white">{value}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-[#191a22]">
              <Icon className={`h-4 w-4 ${iconClass}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <UsersTable users={users} />
    </div>
  )
}
