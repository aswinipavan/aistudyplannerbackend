export interface StudentProfile {
  id: string;
  firebaseUid: string;
  name: string;
  email: string;
  photoUrl?: string;
  grade?: string;
  isPremium: boolean;
  createdAt: string;
  isNewUser?: boolean; // Used for frontend onboarding flow
}

export interface Subject {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  targetHours?: number;
  studentId: string;
  
  // Kept for UI compatibility with Phase 1 mocks
  totalHoursStudied?: number;
  priorityScore?: number;
}

export interface CreateSubjectDTO {
  name: string;
  color: string;
}

export interface Exam {
  id: string;
  subjectId: string;
  subject?: Subject;
  examDate: string; // ISO date string
  difficulty: 'easy' | 'medium' | 'hard';
  notes?: string;
}

export interface TimetableSlot {
  id: string;
  subjectId: string;
  subject?: Subject;
  startTime: string;
  endTime: string;
  date: string;
  status: 'pending' | 'completed' | 'skipped';
  timetableId: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  fileUrl: string;
  fileType: 'pdf' | 'image' | 'video' | 'doc';
  subjectId: string;
  uploadedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sessionId: string;
  timestamp: string;
}

export interface Mark {
  id: string;
  subjectId: string;
  score: number;
  maxScore: number;
  testName: string;
  date: string;
}

export interface SubjectPerformance {
  subjectId: string;
  subjectName: string;
  averageScore: number;
  marksHistory: Mark[];
  priority: number;
}

export interface PerformanceReport {
  overallAverage: number;
  subjectBreakdown: SubjectPerformance[];
  trend: 'improving' | 'declining' | 'stable';
  recommendations: string[];
}

export interface SubscriptionStatus {
  isPremium: boolean;
  plan?: 'monthly' | 'yearly';
  expiresAt?: string;
  features: string[];
}
