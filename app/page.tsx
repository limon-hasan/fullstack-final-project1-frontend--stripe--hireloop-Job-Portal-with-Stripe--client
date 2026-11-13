import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col bg-[#08080a]">
      <main className="flex-1">
        <Hero />
      </main>
    </div>
  )
}
