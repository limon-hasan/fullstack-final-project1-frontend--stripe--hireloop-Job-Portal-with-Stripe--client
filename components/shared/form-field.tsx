import type * as React from "react"
import type { LucideIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const inputClassName =
  "h-11 rounded-xl border-white/[0.06] bg-[#191a21] text-sm text-white placeholder:text-zinc-500 focus-visible:border-[#5b4df5] focus-visible:ring-[#5b4df5]/25"

const selectClassName =
  "h-11 w-full rounded-xl border border-white/[0.06] bg-[#191a21] px-3.5 text-sm text-white transition-colors outline-none focus:border-[#5b4df5]"

const textareaClassName =
  "rounded-xl border-white/[0.06] bg-[#191a21] p-3.5 text-sm text-white placeholder:text-zinc-500 focus-visible:border-[#5b4df5] focus-visible:ring-[#5b4df5]/25"

interface FormFieldProps {
  label: React.ReactNode
  htmlFor?: string
  required?: boolean
  hint?: React.ReactNode
  className?: string
  children: React.ReactNode
}

export function FormField({
  label,
  htmlFor,
  required,
  hint,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={htmlFor} className="text-xs font-medium text-zinc-300">
          {label}
          {required && <span className="text-[#7c73f8]"> *</span>}
        </Label>
        {hint && <span className="text-[11px] text-zinc-500">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

interface TextFieldProps extends React.ComponentProps<typeof Input> {
  label: React.ReactNode
  icon?: LucideIcon
  leading?: React.ReactNode
  hint?: React.ReactNode
  fieldClassName?: string
  requiredMark?: boolean
}

export function TextField({
  label,
  icon: Icon,
  leading,
  hint,
  required,
  requiredMark = required,
  className,
  fieldClassName,
  ...props
}: TextFieldProps) {
  return (
    <FormField
      label={label}
      htmlFor={props.id}
      required={requiredMark}
      hint={hint}
      className={fieldClassName}
    >
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        )}
        {leading}
        <Input
          required={required}
          className={cn(
            inputClassName,
            Icon && "pl-10",
            leading && "pl-8",
            className
          )}
          {...props}
        />
      </div>
    </FormField>
  )
}

interface SelectFieldProps extends React.ComponentProps<"select"> {
  label: React.ReactNode
  options: readonly string[]
  hint?: React.ReactNode
  fieldClassName?: string
  requiredMark?: boolean
}

export function SelectField({
  label,
  options,
  hint,
  required,
  requiredMark = required,
  className,
  fieldClassName,
  ...props
}: SelectFieldProps) {
  return (
    <FormField
      label={label}
      htmlFor={props.id}
      required={requiredMark}
      hint={hint}
      className={fieldClassName}
    >
      <select
        required={required}
        className={cn(selectClassName, className)}
        {...props}
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#191a21]">
            {option}
          </option>
        ))}
      </select>
    </FormField>
  )
}

interface TextareaFieldProps extends React.ComponentProps<typeof Textarea> {
  label: React.ReactNode
  hint?: React.ReactNode
  fieldClassName?: string
  requiredMark?: boolean
}

export function TextareaField({
  label,
  hint,
  required,
  requiredMark = required,
  className,
  fieldClassName,
  ...props
}: TextareaFieldProps) {
  return (
    <FormField
      label={label}
      htmlFor={props.id}
      required={requiredMark}
      hint={hint}
      className={fieldClassName}
    >
      <Textarea
        required={required}
        className={cn(textareaClassName, className)}
        {...props}
      />
    </FormField>
  )
}
