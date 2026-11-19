export interface JobApplicant {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  stream: string;
  studentId?: string;
  qualification: string;
  college?: string;
  portfolioUrl?: string;
  coverNote?: string;
  appliedAt: string;
  status: 'Under Review' | 'Shortlisted' | 'Interview Scheduled' | 'Rejected';
}

export interface JobPost {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  discipline: 'civil' | 'mechanical' | 'electrical' | 'piping' | 'interior' | 'ppm' | 'all';
  jobType: 'Full-Time' | 'Full-time' | 'Internship' | 'Apprenticeship' | 'Contract' | 'Fresher Drive';
  workMode: 'On-site' | 'Hybrid' | 'Remote';
  location: string;
  salary: string;
  experience: string;
  vacancies: number;
  tools: string[];
  skills?: string[];
  stream?: string;
  description: string;
  requirements: string[];
  postedDate: string;
  deadline?: string;
  status: 'Active' | 'Closed';
  isFeatured?: boolean;
  applicantsCount: number;
  applicants: JobApplicant[];
}

export interface JobNotification {
  id: string;
  jobId: string;
  title: string;
  company: string;
  discipline: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

// Initial verified industry placement opportunities from partner EPCs & software leaders
export const INITIAL_JOBS: JobPost[] = [];

export const INITIAL_NOTIFICATIONS: JobNotification[] = [];
