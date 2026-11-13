"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Lock, Mail } from "lucide-react"

import { AuthInput } from "@/components/auth/auth-input"
import {
  AuthError,
  AuthFooter,
  AuthHeader,
  AuthLayout,
} from "@/components/auth/auth-layout"
import { AuthSubmitButton } from "@/components/auth/auth-submit-button"
import { authClient } from "@/lib/auth-client"

export default function SignInPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    if (errorMessage) setErrorMessage(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const { data: signInData, error } = await authClient.signIn.email({
        email: formData.email.trim(),
        password: formData.password,
        callbackURL: "/",
        rememberMe: formData.rememberMe,
      })

      console.log("Sign In Response:", signInData, error)

      if (error) {
        setErrorMessage(
          error.message || "Invalid email or password. Please try again."
        )
        return
      }

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
    <AuthLayout>
      <AuthHeader
        title="Welcome back"
        subtitle="Sign in to access your dashboard and applications"
      />

      <AuthError message={errorMessage} />

      <form onSubmit={handleSubmit} className="space-y-4">
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
          disabled={isLoading}
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          label="Password"
          icon={Lock}
          revealable
          action={
            <Link
              href="#"
              className="text-xs text-[#5c87ff] hover:text-[#84a4ff]"
            >
              Forgot password?
            </Link>
          }
        />

        <div className="flex items-center gap-2 pt-1">
          <input
            id="rememberMe"
            name="rememberMe"
            type="checkbox"
            disabled={isLoading}
            checked={formData.rememberMe}
            onChange={handleChange}
            className="size-4 rounded border-white/20 bg-[#16161a] text-[#5b4df5] focus:ring-[#5b4df5]/40"
          />
          <label
            htmlFor="rememberMe"
            className="text-xs text-neutral-400 select-none"
          >
            Remember me for 30 days
          </label>
        </div>

        <AuthSubmitButton loading={isLoading} loadingLabel="Signing in...">
          Sign In
        </AuthSubmitButton>
      </form>

      <AuthFooter
        prompt="Don't have an account?"
        href="/signup"
        linkLabel="Sign up"
      />
    </AuthLayout>
  )
}
