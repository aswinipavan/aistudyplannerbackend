import { apiClient } from './client';
import { Subject } from '../types/api.types';

export interface ActiveTask {
  id: string;
  title: string;
  subjectName: string;
  subjectColor: string;
  time: string;
  isCompleted: boolean;
}

export interface UpcomingExam {
  id: string;
  title: string;
  date: string;
  daysRemaining: number;
}

export interface DashboardData {
  activeTasks: ActiveTask[];
  upcomingExams: UpcomingExam[];
  prioritySubjects: Subject[];
}

export const dashboardApi = {
  getOverview: async (): Promise<DashboardData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          activeTasks: [
            { id: 't1', title: 'Calculus Chapter 4', subjectName: 'Mathematics', subjectColor: '#FF5722', time: '10:00 AM - 11:30 AM', isCompleted: false },
            { id: 't2', title: 'Kinematics Problems', subjectName: 'Physics', subjectColor: '#2196F3', time: '12:00 PM - 01:00 PM', isCompleted: false },
          ],
          upcomingExams: [
            { id: 'e1', title: 'Math Midterm', date: '2026-06-25', daysRemaining: 8 },
            { id: 'e2', title: 'Physics Quiz', date: '2026-06-30', daysRemaining: 13 },
          ],
          prioritySubjects: [
            { id: '2', name: 'Physics', color: '#2196F3', totalHoursStudied: 8.0, priorityScore: 92, studentId: 'u1' },
            { id: '1', name: 'Mathematics', color: '#FF5722', totalHoursStudied: 12.5, priorityScore: 85, studentId: 'u1' },
          ]
        });
      }, 1000);
    });
  }
};
