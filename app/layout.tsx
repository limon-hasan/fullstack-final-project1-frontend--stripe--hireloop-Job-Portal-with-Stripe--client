import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { SiteFooter } from "@/components/SiteFooter"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/Navbar"
import { Toaster } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    default: "HireLoop | Find your next role, faster",
    template: "%s | HireLoop",
  },
  description:
    "HireLoop connects top talent with world-class companies. Browse curated opportunities, track every application and land your next role faster.",
  applicationName: "HireLoop",
  keywords: [
    "jobs",
    "hiring",
    "careers",
    "recruiting",
    "remote jobs",
    "job board",
  ],
  openGraph: {
    title: "HireLoop | Find your next role, faster",
    description:
      "Curated roles, transparent salaries and application tracking that keeps everyone moving.",
    siteName: "HireLoop",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HireLoop | Find your next role, faster",
    description:
      "Curated roles, transparent salaries and application tracking that keeps everyone moving.",
  },
}

export const viewport: Viewport = {
  themeColor: "#08080a",
  colorScheme: "dark",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(fontMono.variable, geist.variable)}
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-[#5b4df5]/30 selection:text-white">
        <ThemeProvider>
          <Navbar />
          {children}
          <SiteFooter />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
