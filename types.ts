
export enum UserRole {
  GUEST = 'GUEST',
  STUDENT = 'STUDENT',
  COMPANY = 'COMPANY',
  ADMIN = 'ADMIN'
}

export interface SiteConfig {
  baseFontSize: number;
  enableDarkMode: boolean;
}

export interface Review {
  id: string;
  problemTitle: string;
  rating: number;
  feedback: string;
  createdAt: string;
  companyName: string;
}

export interface Payment {
  id: string;
  problemId: string;
  problemTitle: string;
  amount: string; // Gross amount
  commissionAmount: string; // 10%
  netAmount: string; // 90%
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  timestamp: string;
  method: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  university?: string;
  companyName?: string;
  rating?: number;
  solvedCount?: number;
  reviews?: Review[];
  lastSeen?: string;
  bio?: string;
  profilePicUrl?: string;
  skills?: string[];
  websiteUrl?: string;
  isBanned?: boolean;
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
