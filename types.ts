
export enum UserRole {
  GUEST = 'GUEST',
  STUDENT = 'STUDENT',
  COMPANY = 'COMPANY',
  MENTOR = 'MENTOR',
  ADMIN = 'ADMIN'
}

export type SkillLevel = 'Beginner' | 'Junior' | 'Intermediate' | 'Advanced';

export type VerificationStatus = 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  awardedAt: string;
  bonusPoints: number;
}

export interface User {
  id: string;
  name: string;
  username?: string;
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
  rating?: number; // Mentor rating
  leaderboardScore?: number; // Calculated platform score
  skillLevel?: SkillLevel;
  rollingAverage?: number; // Last 5 scores
  penaltyPoints?: number;
  solvedCount?: number;
  simSolvedCount?: number;
  badges?: Badge[];
  reviews?: Review[];
  lastSeen?: string;
  bio?: string;
  profilePicUrl?: string;
  skills?: string[];
  isBanned?: boolean;
  isVerified?: boolean; // Legacy/Compat
  verificationStatus?: VerificationStatus;
  joinedAt?: string;
  auditNotification?: {
    problemId: string;
    problemTitle: string;
    status: 'VERIFIED' | 'REJECTED';
    feedback: string;
    read: boolean;
  };
}

export interface Review {
  id: string;
  problemTitle: string;
  rating: number;
  feedback: string;
  createdAt: string;
  companyName: string;
}

export interface AiEvaluation {
  suggestedScore: number;
  reasoning: string;
  flags: string[]; // ['Logic Error', 'Over-engineered', 'Excellent Docs']
}

export interface PlagiarismMetadata {
  similarityPercentage: number;
  targetSolutionId?: string;
  status: 'CLEAN' | 'FLAGGED' | 'PENALIZED';
}

export interface Solution {
  id: string;
  problemId: string;
  studentId: string;
  studentName: string;
  content: string;
  githubLink?: string;
  techStack?: string;
  limitations?: string;
  submittedAt: string;
  isAccepted: boolean;
  isVerified?: boolean;
  isRejected?: boolean;
  reviewStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  rating?: number; // The score (0-100)
  feedback?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  mentorId?: string;
  mentorName?: string;
  aiEvaluation?: AiEvaluation;
  plagiarismMetadata?: PlagiarismMetadata;
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
  isSimulation?: boolean;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  createdAt: string;
  tags: string[];
  solutions: Solution[];
  // New lock fields for Practice problems
  lockedByStudentId?: string;
  lockedByStudentName?: string;
  lockExpiresAt?: string; // ISO String
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

export interface SiteConfig {
  baseFontSize: number;
  enableDarkMode: boolean;
}
