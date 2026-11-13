import { cn } from "@/lib/utils"

interface SectionCardProps {
  title: string
  className?: string
  children: React.ReactNode
}

export function SectionCard({ title, className, children }: SectionCardProps) {
  return (
    <section
      className={cn(
        "space-y-5 rounded-2xl border border-white/[0.07] bg-[#121318] p-6",
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        <span className="h-2 w-2 rounded-full bg-[#5b4df5]" />
        <h2 className="text-base font-semibold text-white">{title}</h2>
      </div>
      {children}
    </section>
  )
}
