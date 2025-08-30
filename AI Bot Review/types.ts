export interface ReviewFilters {
  search: string;
  language: string;
  severity: string;
  status: string;
}

export interface DashboardStats {
  totalRepositories: number;
  totalSubmissions: number;
  totalIssues: number;
  averageScore: number;
  criticalIssues: number;
  resolvedIssues: number;
}

export const languages = [
  "All Languages",
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "Go",
  "Rust",
  "PHP",
  "Ruby"
];

export const severities = [
  "All Severities",
  "Critical",
  "Warning",
  "Info"
];

export const statuses = [
  "All Status",
  "Pending",
  "Analyzing",
  "Completed",
  "Failed"
];

export const issueTypes = [
  "security",
  "performance",
  "style",
  "bug",
  "maintainability"
];

export const sortOptions = [
  "Recent",
  "Score",
  "Issues",
  "Repository"
];
