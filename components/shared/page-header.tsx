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
}

export function PageHeader({
  breadcrumbs,
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-zinc-400">
          {breadcrumbs.map((item, index) => (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 && (
                <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
              )}
              {item.href ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    index === breadcrumbs.length - 1
                      ? "text-[#7c73f8]"
                      : undefined
                  }
                >
                  {item.label}
                </span>
              )}
            </Fragment>
          ))}
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-zinc-400">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}
