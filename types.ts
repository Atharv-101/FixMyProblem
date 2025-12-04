
export enum UserRole {
  GUEST = 'GUEST',
  STUDENT = 'STUDENT',
  COMPANY = 'COMPANY',
  ADMIN = 'ADMIN'
}

export interface SiteConfig {
  baseFontSize: number; // in pixels, default 16
  enableDarkMode: boolean; // default true
}

export interface Review {
  id: string;
  problemTitle: string;
  rating: number; // 1-5
  feedback: string;
  createdAt: string;
  companyName: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  university?: string; // Only for students
  companyName?: string; // Only for companies
  rating?: number; // Only for students (0-5)
  solvedCount?: number;
  reviews?: Review[];
  lastSeen?: string; // Timestamp for online presence
  // Profile Fields
  bio?: string;
  profilePicUrl?: string;
  skills?: string[]; // Array of strings for tags
  websiteUrl?: string; // For companies or portfolios
  isBanned?: boolean; // Status for admin ban
}

export interface Solution {
  id: string;
  problemId: string;
  studentId: string;
  studentName: string;
  content: string;
  submittedAt: string;
  isAccepted: boolean;
  rating?: number;
  feedback?: string;
  attachmentUrl?: string;
  attachmentName?: string;
}

export interface Problem {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  description: string;
  bounty: string;
  status: 'OPEN' | 'CLOSED';
  createdAt: string;
  tags: string[];
  solutions: Solution[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}