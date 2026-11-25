"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUpRight } from "lucide-react"

import logo from "@/app/images/logo.png"
import { SITE_NAV } from "@/lib/constants/marketing"

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Browse jobs", href: "/browse-jobs" },
      { label: "Pricing", href: "/pricing" },
      { label: "Companies", href: "/company" },
      { label: "Dashboard", href: "/dashboard/seeker" },
    ],
  },
  {
    title: "For candidates",
    links: [
      { label: "Create profile", href: "/signup" },
      { label: "Saved jobs", href: "/dashboard/seeker/saved-jobs" },
      { label: "My applications", href: "/dashboard/seeker/applications" },
      { label: "Pro plan", href: "/checkout" },
    ],
  },
  {
    title: "For employers",
    links: [
      { label: "Post a job", href: "/dashboard/recruiter/jobs/new" },
      { label: "Manage jobs", href: "/dashboard/recruiter/jobs" },
      { label: "Applicants", href: "/dashboard/recruiter/applications" },
      { label: "Company profile", href: "/dashboard/recruiter/company" },
    ],
  },
]

const socialLinks = [
  { label: "X / Twitter", href: "https://twitter.com", mark: "X" },
  { label: "LinkedIn", href: "https://linkedin.com", mark: "in" },
  { label: "GitHub", href: "https://github.com", mark: "gh" },
]

export function SiteFooter() {
  const pathname = usePathname()

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/checkout")) {
    return null
  }

  return (
    <footer className="relative mt-24 border-t border-white/[0.06] bg-[#08080a]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px w-2/3 bg-gradient-to-r from-transparent via-[#5b4df5]/60 to-transparent"
      />

      <div className="mx-auto w-full max-w-[1400px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center">
              <Image src={logo} alt="HireLoop" className="h-9 w-auto" />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500">
              A calmer, faster way to hire and get hired. Curated roles,
              transparent salaries and pipelines that keep everyone moving.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {socialLinks.map(({ label, href, mark }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-[#101116] text-[11px] font-semibold text-zinc-400 transition-colors hover:border-white/20 hover:text-white"
                >
                  {mark}
                </a>
              ))}
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-[11px] font-semibold tracking-[0.16em] text-zinc-500 uppercase">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} HireLoop. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-500">
            {SITE_NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/unauthorized"
              className="inline-flex items-center gap-1 transition-colors hover:text-white"
            >
              Access help
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
