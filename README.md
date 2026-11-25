# HireLoop Client

> **About:** HireLoop is a modern, role-based job board and hiring platform frontend built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Base UI / shadcn**, **Better Auth**, and **Stripe**. It connects job seekers, recruiters, and admins with real-time application tracking, saved jobs, light/dark themes, and Stripe-powered Pro subscriptions.

---

## Key Features

### Public & Marketing Experience
- **Landing Page (`/`)**: Hero job search with trending tags, live featured openings, discipline showcase, workflow overview, testimonials, and call-to-action sections.
- **Browse Jobs (`/browse-jobs`)**: Filterable and sortable job board (category, work mode, job type, salary, location, and keyword search) with bookmarking and one-click applications.
- **Job Details (`/browse-jobs/[id]`)**: Full role breakdown, overview metrics, company details, benefits, and instant apply flow.
- **Companies & Pricing (`/company`, `/pricing`)**: Employer directory and transparent Starter, Pro, and Teams plans.

### Role-Based Dashboards (`/dashboard/*`)
Protected by `proxy.ts` and server-side session/role checks:
- **Job Seeker (`/dashboard/seeker`)**:
  - **Overview**: Live application pipeline, interview/offer stats, and profile completion checklist.
  - **Saved Jobs (`/dashboard/seeker/saved-jobs`)**: Local-storage synced bookmarks with search and bulk clear.
  - **Applications (`/dashboard/seeker/applications`)**: Filterable active/archived applications board with status badges and PDF print export.
  - **Billing & Transactions (`/dashboard/seeker/billing`, `/dashboard/seeker/transactions`)**: Subscription status, Stripe checkout integration, live Stripe transaction history, and downloadable receipts.
  - **My Profile (`/dashboard/seeker/profile`)**: Public profile with real-time dynamic stats (applications, saved jobs, profile views) and inline editing.
- **Recruiter (`/dashboard/recruiter`)**:
  - **Overview**: Active listings, applicant counts, and hiring rate analytics.
  - **Manage Jobs & Post a Job (`/dashboard/recruiter/jobs`, `/dashboard/recruiter/jobs/new`)**: Full CRUD for job listings with edit and delete confirmation dialogs.
  - **Applicants (`/dashboard/recruiter/applications`)**: Review candidates and update application stages (`Review`, `Shortlisted`, `Interview`, `Offered`, `Rejected`).
  - **Company Profile (`/dashboard/recruiter/company`)**: Manage company branding and details.
- **Admin (`/dashboard/admin`)**:
  - **Overview**: Platform-wide metrics across users, companies, jobs, and applications.
  - **Users (`/dashboard/admin/users`)**: Searchable user directory with role management (`seeker`, `recruiter`, `admin`).
  - **Companies & Jobs (`/dashboard/admin/companies`, `/dashboard/admin/jobs`)**: Platform-wide moderation and filtering.
  - **Payments (`/dashboard/admin/payments`)**: Live Stripe revenue metrics and full transaction ledger.

### UX & Polish
- **Light & Dark Themes**: Default dark theme (`#08080a` / `#5b4df5`) with a professional light theme toggle in the navbar/topbar and `D` keyboard shortcut.
- **Loading States**: Route-level `loading.tsx` skeletons and branded spinners across public, auth, checkout, and dashboard pages.
- **Toast Notifications**: Contextual toasts for authentication (sign in, sign up, sign out), job/application CRUD, role updates, bookmarks, and clipboard actions.
- **Stripe Checkout (`/checkout`, `/checkout/success`)**: Currency selector (`USD` / `BDT`), Stripe Checkout session creation, server-side payment verification, and receipt view with direct link to Payment History.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4, `tw-animate-css`, `cn`
- **UI Primitives**: shadcn (`base-nova` on `@base-ui/react`), Lucide React icons
- **Authentication**: Better Auth (`better-auth`, `@better-auth/mongo-adapter`)
- **Payments**: Stripe (`stripe`, `@stripe/stripe-js`)
- **Theming**: `next-themes`

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm
- A running HireLoop REST API server (`NEXT_PUBLIC_API_BASE_URL`)
- MongoDB instance (for Better Auth)
- Stripe account & keys (for checkout & transaction history)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_DB_URI=your_mongodb_connection_uri

NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key

STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start the Next.js Turbopack development server on port 3000 |
| `npm run build` | Build the production bundle (requires API server reachable for SSR pages) |
| `npm run start` | Start the production server |
| `npm run typecheck` | Run TypeScript type checking (`tsc --noEmit`) |
| `npm run lint` | Run ESLint across the project |
| `npm run format` | Format TypeScript and TSX files with Prettier |

---

## Project Structure

```text
app/
  (auth)/                 # Sign in and sign up pages
  api/                    # Better Auth catch-all & Stripe checkout session routes
  browse-jobs/            # Public job board and job details
  checkout/               # Stripe checkout & payment verification success page
  company/                # Public companies directory
  dashboard/              # Role-based dashboards (seeker, recruiter, admin)
  pricing/                # Subscription plans
  unauthorized/           # Access denied page
components/
  auth/                   # Auth layout, inputs, and submit button
  dashboard/              # Sidebar, topbar, profile, settings, job/company forms, tables
  home/                   # Marketing homepage sections
  shared/                 # BrandButton, PageHeader, SectionCard, StatCard, ThemeToggle, loaders
  ui/                     # Base UI / shadcn primitives
hooks/                    # Custom hooks (use-saved-jobs, use-mobile, etc.)
lib/
  actions/                # Client-side & server mutation helpers
  api/                    # Server-side data fetchers (jobs, applications, users, payments)
  constants/              # Job options and marketing constants
  core/                   # Server session & authenticated fetch helpers
types/                    # Shared TypeScript domain types
proxy.ts                  # Route protection for /dashboard/*
```
