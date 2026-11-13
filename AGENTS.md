<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# HireLoop client

Client-only Next.js 16 (App Router) job board. The REST API is a separate service at `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:8000`) and must be running for job pages and for `npm run build`.

## Commands

- `npm run dev` — Turbopack dev server at http://localhost:3000
- `npm run lint` / `npm run typecheck` — the only verification available; there is no test suite
- `npm run build` — `/dashboard/recruiter/jobs` fetches the external API while rendering, so the build needs the API reachable
- `npm run format` — Prettier over `**/*.{ts,tsx}` only; use `npx prettier --write <file>` for CSS/JSON/Markdown
- npm + `package-lock.json`; single package, no workspaces, no CI workflows

`npm run lint` currently fails on two pre-existing `react-hooks/set-state-in-effect` errors in `components/ui/carousel.tsx` and `hooks/use-mobile.ts`. Don't assume your change caused them unless you touched those files.

Prettier differs from common defaults: no semicolons, double quotes, LF, 2 spaces, Tailwind class sorting (`cn`/`cva`). Running it will strip the semicolons currently present in `lib/`.

## Layout

- `app/` — App Router. `app/(auth)/` serves `/signin` and `/signup`; dashboards are `/dashboard/{seeker,recruiter,admin}`.
- `components/ui/` — shadcn primitives. `components/` — marketing (`Navbar`, `Hero`). `app/components/` — dashboard features (`DashboardSidebar`, `DeleteJobDialog`). Keep new files in the matching location.
- `lib/api/` — fetches used from async Server Components. `lib/actions/` — plain client-side fetches, **not** Server Actions despite the name.
- `@/*` maps to the repo root, not `src/`.
- Only the recruiter jobs flow is implemented; the seeker and admin dashboards are placeholders.

## UI conventions

- shadcn here is the **base-nova** flavor built on Base UI (`@base-ui/react`), not Radix. Compose with `render={<Link href="..." />}`; `asChild` does not work.
- Add primitives with `npx shadcn@latest add <name>` so they match `components.json`; don't paste Radix-based shadcn examples.
- Tailwind v4: there is no `tailwind.config.*`; tokens live in `app/globals.css` (`@theme inline` plus CSS variables).
- Pages are hardcoded dark (`#08080a` background, `#5b4df5` accent, zinc text) instead of theme tokens, even though `next-themes` and the `d` shortcut exist in `components/theme-provider.tsx`. Keep new UI dark unless asked.
- `cn` comes from the `cn` package; `lib/utils.ts` re-exports it, and shadcn files import `"cn"` directly. Both are intentional.
- `Navbar` is rendered once in `app/layout.tsx` and hides itself on `/dashboard`. Don't add it per page; the unused import in `app/page.tsx` is leftover.

## Auth and API

- better-auth + MongoDB: server config `lib/auth.ts`, client `lib/auth-client.ts`, handler `app/api/auth/[...all]/route.ts`. Email/password is the working flow; the GitHub provider reads `process.env.GOOGLE` and is effectively unconfigured.
- Env (`.env`, gitignored): `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `BETTER_AUTH_DB_URI`, `NEXT_PUBLIC_API_BASE_URL`.
- Roles are `seeker | recruiter | admin` on `user.role` via better-auth `additionalFields`; the sidebar prefers the role in the URL over the session role.
- No `proxy.ts` exists, so dashboards are not server-protected. Next 16 renamed middleware to `proxy.ts` — add protection there. In client event handlers use `useRouter().push()`; `redirect()` throws outside render/actions, as in `app/dashboard/recruiter/jobs/new/page.tsx`.
- `lib/api/jobs.ts` and `lib/actions/jobs.ts` call the external API with no error handling and assume JSON arrays/objects. Guard there rather than duplicating fetches.
- `JobPayload` and `ManagedJob` are declared in page files and imported elsewhere; keep those imports type-only.

`CLAUDE.md` just imports this file, so keep `AGENTS.md` the single source of instructions.
