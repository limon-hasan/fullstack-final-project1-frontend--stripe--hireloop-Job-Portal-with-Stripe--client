import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check session cookie
  const hasSession = request.cookies
    .getAll()
    .some((cookie) => cookie.name.includes("better-auth.session"))

  if (!hasSession) {
    const signInUrl = new URL("/signin", request.url)
    signInUrl.searchParams.set("redirectTo", `${pathname}${request.nextUrl.search}`)
    return NextResponse.redirect(signInUrl)
  }

  // Role-based path protection via cookie claim
  // better-auth stores session data server-side; we can read a lightweight
  // role hint from a cookie set after sign-in (see below), or we skip
  // granular role checks here and rely on each page doing getSession() +
  // requireRole(). The middleware only ensures auth presence for all
  // /dashboard/* routes — per-page server components handle role enforcement.
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
