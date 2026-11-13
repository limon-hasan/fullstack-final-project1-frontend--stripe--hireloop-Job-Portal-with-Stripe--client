"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Building2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User,
  UserCheck,
} from "lucide-react"

import logo from "@/app/images/logo.png"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

type UserRole = "seeker" | "recruiter" | "admin"

const roles: { id: UserRole; label: string; icon: React.ElementType }[] = [
  { id: "seeker", label: "Seeker", icon: UserCheck },
  { id: "recruiter", label: "Recruiter", icon: Building2 },
  { id: "admin", label: "Admin", icon: ShieldCheck },
]

export default function SignUpPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
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
    <div className="flex min-h-screen w-full items-center justify-center bg-[#08080a] p-4 text-white">
      {/* Background radial glow */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
        <div className="h-[450px] w-[550px] rounded-full bg-[#5b4df5]/15 blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-[460px] rounded-2xl border border-white/10 bg-[#121215]/85 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
        {/* Logo and Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <Link href="/" className="mb-5 inline-block">
            <Image src={logo} alt="HireLoop" className="h-9 w-auto" priority />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Create an account
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Select your account type and get started
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-xs font-medium text-red-400">
            {errorMessage}
          </div>
        )}

        {/* 3-Role Toggle Selector */}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="text-xs font-medium text-neutral-300"
            >
              Full Name
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 size-4 text-neutral-500" />
              <input
                id="name"
                name="name"
                type="text"
                required
                disabled={isLoading}
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="h-11 w-full rounded-xl border border-white/10 bg-[#16161a] pr-4 pl-10 text-sm text-white placeholder-neutral-500 transition-colors outline-none focus:border-[#5b4df5] focus:ring-1 focus:ring-[#5b4df5] disabled:opacity-50"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-xs font-medium text-neutral-300"
            >
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 size-4 text-neutral-500" />
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={isLoading}
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                className="h-11 w-full rounded-xl border border-white/10 bg-[#16161a] pr-4 pl-10 text-sm text-white placeholder-neutral-500 transition-colors outline-none focus:border-[#5b4df5] focus:ring-1 focus:ring-[#5b4df5] disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-xs font-medium text-neutral-300"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 size-4 text-neutral-500" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                disabled={isLoading}
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                className="h-11 w-full rounded-xl border border-white/10 bg-[#16161a] pr-10 pl-10 text-sm text-white placeholder-neutral-500 transition-colors outline-none focus:border-[#5b4df5] focus:ring-1 focus:ring-[#5b4df5] disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-neutral-500 transition-colors hover:text-neutral-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="mt-2 h-11 w-full rounded-xl bg-[#5b4df5] text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(91,77,245,0.9)] hover:bg-[#6c5ff7] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Creating account...
              </span>
            ) : (
              `Create ${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} Account`
            )}
          </Button>
        </form>

        {/* Toggle to Sign In */}
        <p className="mt-6 text-center text-xs text-neutral-400">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-medium text-[#5c87ff] hover:text-[#84a4ff] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
