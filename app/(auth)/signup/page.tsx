"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Building2,
  Lock,
  Mail,
  ShieldCheck,
  User,
  UserCheck,
  type LucideIcon,
} from "lucide-react"

import { AuthInput } from "@/components/auth/auth-input"
import {
  AuthError,
  AuthFooter,
  AuthHeader,
  AuthLayout,
} from "@/components/auth/auth-layout"
import { AuthSubmitButton } from "@/components/auth/auth-submit-button"
import { authClient } from "@/lib/auth-client"
import type { UserRole } from "@/types/auth"

const roles: { id: UserRole; label: string; icon: LucideIcon }[] = [
  { id: "seeker", label: "Seeker", icon: UserCheck },
  { id: "recruiter", label: "Recruiter", icon: Building2 },
  { id: "admin", label: "Admin", icon: ShieldCheck },
]

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    role: "seeker" as UserRole,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errorMessage) setErrorMessage(null)
  }

  const handleRoleSelect = (role: UserRole) => {
    setFormData((prev) => ({ ...prev, role }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const { data: signUpData, error } = await authClient.signUp.email({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        callbackURL: "/",
      } as Parameters<typeof authClient.signUp.email>[0] & { role: UserRole })

      if (error) {
        setErrorMessage(
          error.message || "Failed to create account. Please try again."
        )
        return
      }

      console.log("Sign up successful:", signUpData)
      router.push("/")
      router.refresh()
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred."
      setErrorMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout maxWidth="max-w-[460px]">
      <AuthHeader
        title="Create an account"
        subtitle="Select your account type and get started"
      />

      <AuthError message={errorMessage} />

      <div className="mb-6 grid grid-cols-3 gap-1.5 rounded-xl border border-white/10 bg-[#16161a] p-1.5">
        {roles.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            disabled={isLoading}
            onClick={() => handleRoleSelect(id)}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold transition-all ${
              formData.role === id
                ? "bg-[#5b4df5] text-white shadow-md"
                : "text-neutral-400 hover:text-white"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <Icon className="size-3.5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          id="name"
          name="name"
          type="text"
          required
          disabled={isLoading}
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          label="Full Name"
          icon={User}
        />

        <AuthInput
          id="email"
          name="email"
          type="email"
          required
          disabled={isLoading}
          value={formData.email}
          onChange={handleChange}
          placeholder="name@company.com"
          label="Email Address"
          icon={Mail}
        />

        <AuthInput
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          disabled={isLoading}
          value={formData.password}
          onChange={handleChange}
          placeholder="At least 8 characters"
          label="Password"
          icon={Lock}
          revealable
        />

        <AuthSubmitButton
          loading={isLoading}
          loadingLabel="Creating account..."
        >
          {`Create ${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} Account`}
        </AuthSubmitButton>
      </form>

      <AuthFooter
        prompt="Already have an account?"
        href="/signin"
        linkLabel="Sign in"
      />
    </AuthLayout>
  )
}
