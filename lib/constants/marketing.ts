import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  Code2,
  Compass,
  Globe2,
  LineChart,
  Megaphone,
  PenTool,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users2,
  Zap,
} from "lucide-react"

export const SITE_NAV = [
  { label: "Browse Jobs", href: "/browse-jobs" },
  { label: "Companies", href: "/company" },
  { label: "Pricing", href: "/pricing" },
] as const

export const TRUSTED_BY = [
  "Northwind",
  "Lumen",
  "Vertex Labs",
  "Orbit",
  "Cascade",
  "Nimbus",
] as const

export const HOME_STATS = [
  { value: "50K+", label: "Curated roles" },
  { value: "12K+", label: "Hiring teams" },
  { value: "2M+", label: "Talent profiles" },
  { value: "97%", label: "Match satisfaction" },
] as const

export const JOB_CATEGORY_SHOWCASE = [
  {
    name: "Engineering & Tech",
    description: "Backend, frontend, platform and infrastructure roles.",
    icon: Code2,
    openings: "18,400",
    accent: "text-sky-300 bg-sky-500/10 border-sky-500/20",
  },
  {
    name: "Design & Creative",
    description: "Product design, brand, motion and research.",
    icon: PenTool,
    openings: "6,200",
    accent: "text-amber-300 bg-amber-500/10 border-amber-500/20",
  },
  {
    name: "Data & Analytics",
    description: "Data engineering, science and analytics.",
    icon: LineChart,
    openings: "8,900",
    accent: "text-cyan-300 bg-cyan-500/10 border-cyan-500/20",
  },
  {
    name: "Marketing & Sales",
    description: "Growth, lifecycle, partnerships and revenue.",
    icon: Megaphone,
    openings: "7,100",
    accent: "text-violet-300 bg-violet-500/10 border-violet-500/20",
  },
  {
    name: "Product & Management",
    description: "Product, program and people leadership.",
    icon: Compass,
    openings: "4,800",
    accent: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    name: "Remote & Global",
    description: "Distributed-first teams hiring worldwide.",
    icon: Globe2,
    openings: "9,600",
    accent: "text-rose-300 bg-rose-500/10 border-rose-500/20",
  },
] as const

export const HOW_IT_WORKS = [
  {
    icon: UserPlus,
    title: "Build a signal-rich profile",
    description:
      "Add your experience, skills and preferences once. Recruiters see the context they need to shortlist you faster.",
  },
  {
    icon: Search,
    title: "Discover roles that fit",
    description:
      "Filter by category, work mode, salary and location. Save the ones you love and come back any time.",
  },
  {
    icon: Send,
    title: "Apply and track everything",
    description:
      "Send applications in one click, follow each stage from review to offer, and never lose track of a conversation.",
  },
] as const

export const CANDIDATE_BENEFITS = [
  "Verified employers only",
  "Real-time application tracking",
  "Salary transparency up front",
  "Saved jobs synced to your dashboard",
] as const

export const RECRUITER_BENEFITS = [
  "Structured applicant pipelines",
  "Status updates in one click",
  "Job performance at a glance",
  "Branded company profile",
] as const

export const TESTIMONIALS = [
  {
    quote:
      "I replaced three spreadsheets and a messy inbox with HireLoop. Shortlisting candidates now takes minutes, not afternoons.",
    name: "Amara Okafor",
    role: "Head of Talent",
    company: "Vertex Labs",
    initials: "AO",
  },
  {
    quote:
      "The application tracker is the first one I have actually kept using. I always know which stage every role is at.",
    name: "Daniel Reyes",
    role: "Senior Product Designer",
    company: "Freelance",
    initials: "DR",
  },
  {
    quote:
      "We hired two engineers in three weeks. The quality of applicants coming through the platform is noticeably higher.",
    name: "Priya Nair",
    role: "Engineering Manager",
    company: "Orbit",
    initials: "PN",
  },
] as const

export const PRICING_PLANS = [
  {
    name: "Starter",
    description: "For candidates exploring their next move.",
    price: "$0",
    cadence: "forever",
    cta: "Create free account",
    href: "/signup",
    highlighted: false,
    features: [
      "Browse every public job",
      "Save up to 10 roles",
      "2 applications per month",
      "Basic application tracking",
    ],
  },
  {
    name: "Pro",
    description: "For serious candidates who want an edge.",
    price: "$20",
    cadence: "per month",
    cta: "Upgrade to Pro",
    href: "/checkout",
    highlighted: true,
    features: [
      "Unlimited applications",
      "Unlimited saved jobs",
      "Priority profile visibility",
      "Interview and offer tracking",
      "One-click application export",
    ],
  },
  {
    name: "Teams",
    description: "For recruiting teams hiring at scale.",
    price: "$49",
    cadence: "per seat / month",
    cta: "Talk to sales",
    href: "/company",
    highlighted: false,
    features: [
      "Everything in Pro",
      "Shared applicant pipelines",
      "Team roles and permissions",
      "Company profile branding",
      "Dedicated success manager",
    ],
  },
] as const

export const PRICING_FAQ = [
  {
    question: "Can I cancel my Pro plan at any time?",
    answer:
      "Yes. Pro is billed monthly and you can cancel from your billing page whenever you like. You keep access until the end of the current period.",
  },
  {
    question: "Do recruiters pay to post jobs?",
    answer:
      "Recruiters can publish their first roles for free. Teams plans unlock shared pipelines, multiple seats and branded company pages.",
  },
  {
    question: "What happens to my applications if I downgrade?",
    answer:
      "Nothing is deleted. Your application history stays available, you simply return to the free monthly application limit.",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "Payments are processed by Stripe. HireLoop never stores your card details on our servers.",
  },
] as const

export const COMPANY_VALUES = [
  {
    icon: ShieldCheck,
    title: "Trust by default",
    description:
      "Every employer is verified and every listing is reviewed before it goes live.",
  },
  {
    icon: Sparkles,
    title: "Craft over volume",
    description:
      "We would rather surface ten great matches than ten thousand noisy listings.",
  },
  {
    icon: Users2,
    title: "People first",
    description:
      "Hiring is a human decision. Our tools remove friction without removing judgement.",
  },
  {
    icon: Zap,
    title: "Momentum matters",
    description:
      "Fast feedback loops keep candidates engaged and teams moving.",
  },
] as const

export const COMPANY_MILESTONES = [
  { value: "2019", label: "Founded in Lisbon" },
  { value: "12K+", label: "Hiring teams onboarded" },
  { value: "48", label: "Countries represented" },
  { value: "97%", label: "Candidate satisfaction" },
] as const

export const COMPANY_TEAM = [
  { name: "Amara Okafor", role: "Co-founder & CEO", initials: "AO" },
  { name: "Jonas Lind", role: "Co-founder & CTO", initials: "JL" },
  { name: "Priya Nair", role: "VP Product", initials: "PN" },
  { name: "Marco Silva", role: "Head of Design", initials: "MS" },
] as const

export const DASHBOARD_ROLE_LABELS = {
  seeker: "Job seeker",
  recruiter: "Recruiter",
  admin: "Administrator",
} as const

export const SEEKER_STEPS = [
  { label: "Profile", icon: UserPlus },
  { label: "Discover", icon: Search },
  { label: "Apply", icon: Send },
  { label: "Interview", icon: BriefcaseBusiness },
  { label: "Offer", icon: Building2 },
] as const

export const ANALYTICS_ICONS = {
  chart: BarChart3,
} as const
