
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

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  university?: string;
  major?: string;
  gradYear?: string;
  companyName?: string;
  teamSize?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  websiteUrl?: string;
  rating?: number;
  solvedCount?: number;
  reviews?: Review[];
  lastSeen?: string;
  bio?: string;
  profilePicUrl?: string;
  skills?: string[];
  isBanned?: boolean;
  joinedAt?: string;
}

export interface Payment {
  id: string;
  problemId: string;
  problemTitle: string;
  amount: string;
  commissionAmount: string;
  netAmount: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  timestamp: string;
  method: string;
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
  expectedBehavior?: string;
  currentBehavior?: string;
  techStack?: string;
  stepsToReproduce?: string;
  impact?: string;
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
