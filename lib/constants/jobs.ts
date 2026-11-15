// export const JOB_TYPES = [
//   "Full-time",
//   "Part-time",
//   "Contract",
//   "Internship",
// ] as const

// export const JOB_CATEGORIES = [
//   "Engineering & Tech",
//   "Design & Creative",
//   "Product Management",
//   "Data & AI",
//   "Marketing & Sales",
// ] as const

// export const SALARY_FREQUENCIES = ["per hour", "per month", "per year"] as const


export const JOB_CATEGORIES = [
  "Engineering & Tech",
  "Design & Creative",
  "Marketing & Sales",
  "Product & Management",
  "Data & Analytics",
] as const;

export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
] as const;

export const SALARY_FREQUENCIES = [
  "per hour",
  "per month",
  "per year",
] as const;

export interface FilterOption {
  label: string;
  value: string;
}

export const JOB_TYPE_OPTIONS: FilterOption[] = JOB_TYPES.map((type) => ({
  label: type,
  value: type,
}));

export const WORK_MODE_OPTIONS: FilterOption[] = [
  { label: "Remote", value: "true" },
  { label: "On-site", value: "false" },
];

export const CATEGORY_OPTIONS: FilterOption[] = JOB_CATEGORIES.map(
  (category) => ({
    label: category,
    value: category,
  })
);

export const SORT_OPTIONS: FilterOption[] = [
  { label: "Most Recent", value: "recent" },
  { label: "Highest Salary", value: "salary-desc" },
  { label: "Lowest Salary", value: "salary-asc" },
];