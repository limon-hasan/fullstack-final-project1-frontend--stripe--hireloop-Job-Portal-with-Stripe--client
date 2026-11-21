import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Navbar } from "@/components/Navbar"
import { Toaster } from "@/components/ui/toast"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "HireLoop | Find Your Dream Job Today",
  description:
    "HireLoop connects top talent with world-class companies. Browse curated opportunities and land your next role.",
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
      <body className="min-h-screen bg-[#08080a] font-sans text-neutral-100 antialiased selection:bg-[#5b4df5]/30 selection:text-white">
        <ThemeProvider>
          <Navbar />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
