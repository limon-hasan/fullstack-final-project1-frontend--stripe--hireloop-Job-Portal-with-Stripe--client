import { Fragment } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeaderProps {
  breadcrumbs: BreadcrumbItem[]
  title: string
  description?: string
  action?: React.ReactNode
  eyebrow?: string
}

export function PageHeader({
  breadcrumbs,
  title,
  description,
  action,
  eyebrow,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-1.5 text-[11px] font-medium tracking-wide text-zinc-500">
          {breadcrumbs.map((item, index) => (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 && (
                <ChevronRight className="h-3 w-3 text-zinc-700" />
              )}
              {item.href ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-zinc-200"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    index === breadcrumbs.length - 1
                      ? "text-[#a99fff]"
                      : undefined
                  }
                >
                  {item.label}
                </span>
              )}
            </Fragment>
          ))}
        </div>

        {eyebrow && (
          <p className="mb-1 text-[11px] font-semibold tracking-[0.16em] text-[#8b81ff] uppercase">
            {eyebrow}
          </p>
        )}

        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-[28px]">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-zinc-400">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
