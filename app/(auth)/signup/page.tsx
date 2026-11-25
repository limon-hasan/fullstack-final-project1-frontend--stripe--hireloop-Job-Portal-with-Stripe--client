"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Building2,
  ImagePlus,
  Loader2,
  Lock,
  Mail,
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

type SignUpRole = Exclude<UserRole, "admin">

const roles: { id: SignUpRole; label: string; icon: LucideIcon }[] = [
  { id: "seeker", label: "Seeker", icon: UserCheck },
  { id: "recruiter", label: "Recruiter", icon: Building2 },
]

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isUploadingImage, setIsUploadingImage] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null)
  const [imageUrl, setImageUrl] = React.useState<string>("")

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    role: "seeker" as SignUpRole,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errorMessage) setErrorMessage(null)
  }

  const handleRoleSelect = (role: SignUpRole) => {
    setFormData((prev) => ({ ...prev, role }))
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setSelectedImage(file)
    setImageUrl("")
    if (errorMessage) setErrorMessage(null)

    if (!file) return

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY
    if (!apiKey) {
      setErrorMessage("Image upload API key is missing.")
      return
    }

    try {
      setIsUploadingImage(true)
      const uploadData = new FormData()
      uploadData.append("image", file)

      const imgbbAPI = `https://api.imgbb.com/1/upload?key=${apiKey}`
      const res = await fetch(imgbbAPI, {
        method: "POST",
        body: uploadData,
      })

      const result = await res.json()

      if (!res.ok || !result?.success || !result?.data?.url) {
        throw new Error(result?.error?.message || "Failed to upload image.")
      }

      setImageUrl(result.data.url)
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to upload image."
      setErrorMessage(message)
      setSelectedImage(null)
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isUploadingImage) return

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const { data: signUpData, error } = await authClient.signUp.email({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        image: imageUrl || undefined,
        role: formData.role,
      })

      if (error) {
        console.error("SignUp error details:", error)
        setErrorMessage(
          error.message || "Failed to create account. Please try again."
        )
        return
      }

      console.log("Sign up successful:", signUpData)
      const dest =
        formData.role === "recruiter"
          ? "/dashboard/recruiter"
          : "/dashboard/seeker"
      router.push(dest)
      router.refresh()
    } catch (err: unknown) {
      console.error("SignUp catch error:", err)
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

      <div className="mb-6 grid grid-cols-2 gap-1.5 rounded-xl border border-white/10 bg-[#16161a] p-1.5">
        {roles.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            disabled={isLoading || isUploadingImage}
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

        <div className="space-y-1.5">
          <label
            htmlFor="profileImage"
            className="block text-xs font-medium text-neutral-300"
          >
            Profile Image
          </label>
          <label
            htmlFor="profileImage"
            className={`flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-[#16161a] px-3.5 py-2.5 text-sm text-neutral-400 transition-colors hover:border-white/20 hover:text-neutral-200 ${
              isLoading || isUploadingImage
                ? "pointer-events-none opacity-60"
                : ""
            }`}
          >
            {isUploadingImage ? (
              <Loader2 className="size-4 shrink-0 animate-spin text-[#5b4df5]" />
            ) : imageUrl ? (
              <img
                src={imageUrl}
                alt="Preview"
                className="size-6 shrink-0 rounded-full object-cover"
              />
            ) : (
              <ImagePlus className="size-4 shrink-0 text-neutral-400" />
            )}
            <span className="truncate">
              {isUploadingImage
                ? "Uploading image..."
                : selectedImage
                  ? selectedImage.name
                  : "Upload profile image"}
            </span>
          </label>
          <input
            id="profileImage"
            name="profileImage"
            type="file"
            accept="image/*"
            disabled={isLoading || isUploadingImage}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <AuthSubmitButton
          loading={isLoading || isUploadingImage}
          loadingLabel={
            isUploadingImage ? "Uploading image..." : "Creating account..."
          }
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
