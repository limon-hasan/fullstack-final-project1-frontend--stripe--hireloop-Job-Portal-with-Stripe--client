"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Ban, CheckCircle2, Clock, Users } from "lucide-react"
import { toast } from "@/components/ui/toast"
import { updateUserRole } from "@/lib/actions/users"
import type { AdminUser, UserRole } from "@/types/users"
import { RoleBadge } from "./role-badge"
import { RoleToggleGroup } from "./role-toggle-group"

interface UsersTableProps {
  users: AdminUser[]
}

function getInitials(name: string, email: string) {
  const source = name?.trim() || email?.trim() || "U"
  const parts = source.split(/\s+/)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return source.slice(0, 2).toUpperCase()
}

function formatJoinedDate(isoString: string) {
  if (!isoString) return "—"
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return "—"

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}

export function UsersTable({ users }: UsersTableProps) {
  const router = useRouter()
  const [roles, setRoles] = useState<Record<string, UserRole>>({})

  const handleRoleChange = async (id: string, role: UserRole) => {
    const previousRole = roles[id] ?? users.find((u) => u.id === id)?.role
    setRoles((prev) => ({ ...prev, [id]: role }))
    try {
      await updateUserRole(id, role)
      toast.add({
        title: "Role updated",
        description: `User role changed to ${role}.`,
      })
      router.refresh()
    } catch (err: unknown) {
      if (previousRole) {
        setRoles((prev) => ({ ...prev, [id]: previousRole }))
      }
      toast.add({
        title: "Failed to update role",
        description:
          err instanceof Error ? err.message : "Please try again.",
      })
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#121318]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="border-b border-white/[0.06] bg-[#15161d] text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
              <th className="px-6 py-4">User</th>
              <th className="px-4 py-4">Current Role</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Switch Role</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/[0.05] text-sm">
            {users.map((user) => {
              const currentRole = roles[user.id] ?? user.role

              return (
                <tr
                  key={user.id}
                  className="transition-colors hover:bg-white/[0.02]"
                >
                  {/* 1. User Avatar, Name & Email */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3.5">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name || user.email}
                          className="h-10 w-10 shrink-0 rounded-full border border-white/[0.08] object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-[#191a22] text-xs font-semibold text-zinc-200">
                          {getInitials(user.name, user.email)}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white">
                          {user.name || "Unnamed User"}
                        </p>
                        <p className="truncate text-xs text-zinc-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* 2. Current Role */}
                  <td className="px-4 py-4">
                    <RoleBadge role={currentRole} />
                  </td>

                  {/* 3. Account & Verification Status */}
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {user.banned ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-400">
                          <Ban className="h-3 w-3" />
                          Banned
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          Active
                        </span>
                      )}

                      {user.emailVerified ? (
                        <span className="inline-flex items-center gap-1 text-xs text-zinc-400">
                          <CheckCircle2 className="h-3.5 w-3.5 text-sky-400" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
                          <Clock className="h-3.5 w-3.5" />
                          Unverified
                        </span>
                      )}
                    </div>
                  </td>

                  {/* 4. Joined Date */}
                  <td className="px-4 py-4 text-xs text-zinc-300">
                    {formatJoinedDate(user.createdAt)}
                  </td>

                  {/* 5. Toggleable Role Buttons */}
                  <td className="px-6 py-4 text-right">
                    <RoleToggleGroup
                      currentRole={currentRole}
                      onSelectRole={(nextRole) =>
                        handleRoleChange(user.id, nextRole)
                      }
                    />
                  </td>
                </tr>
              )
            })}

            {users.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-14 text-center text-sm text-zinc-400"
                >
                  <div className="mx-auto flex max-w-sm flex-col items-center gap-2">
                    <Users className="h-8 w-8 text-zinc-600" />
                    <p className="font-medium text-zinc-200">No users found</p>
                    <p className="text-xs text-zinc-500">
                      Registered users will appear here once accounts are
                      created.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
