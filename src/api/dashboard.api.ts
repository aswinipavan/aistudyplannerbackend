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
    try {
      const [timetableRes, examsRes, performanceRes] = await Promise.all([
        apiClient.get<any>('/api/timetable/active').catch(() => ({ data: { data: { slots: [] } } })),
        apiClient.get<any>('/api/exams/upcoming').catch(() => ({ data: { data: [] } })),
        apiClient.get<any>('/api/performance/priority').catch(() => ({ data: { data: [] } }))
      ]);

      const timetableSlots = timetableRes.data.data?.slots || [];
      const upcomingExamsData = examsRes.data.data || [];
      const prioritySubjectsData = performanceRes.data.data || [];

      // Map active tasks from timetable slots
      const activeTasks: ActiveTask[] = timetableSlots.map((slot: any) => ({
        id: slot.id,
        title: slot.subject?.subjectName ? `Study ${slot.subject.subjectName}` : 'Study Session',
        subjectName: slot.subject?.subjectName || 'Subject',
        subjectColor: slot.subject?.color || '#2196F3',
        time: `${slot.startTime ? slot.startTime.substring(0, 5) : '09:00'} - ${slot.endTime ? slot.endTime.substring(0, 5) : '10:00'}`,
        isCompleted: !!slot.isCompleted
      }));

      // Map upcoming exams
      const upcomingExams: UpcomingExam[] = upcomingExamsData.map((exam: any) => ({
        id: exam.id,
        title: exam.examName || (exam.subject?.subjectName ? `${exam.subject.subjectName} Exam` : 'Exam'),
        date: exam.examDate,
        daysRemaining: exam.daysRemaining || 0
      }));

      // Map priority subjects
      const prioritySubjects: Subject[] = prioritySubjectsData.map((sub: any) => ({
        id: sub.id,
        name: sub.subjectName,
        color: sub.color || '#2196F3',
        icon: sub.icon || 'book',
        studentId: '',
        totalHoursStudied: 0,
        priorityScore: sub.difficultyLevel ? sub.difficultyLevel * 20 : 50
      }));

      return {
        activeTasks,
        upcomingExams,
        prioritySubjects
      };
    } catch (error) {
      console.error("Failed to fetch dashboard data from backend", error);
      return {
        activeTasks: [],
        upcomingExams: [],
        prioritySubjects: []
      };
    }
  },

  /**
   * Marks a timetable slot (task) as completed on the backend.
   */
  completeTask: async (slotId: string): Promise<void> => {
    await apiClient.patch<any>(`/api/timetable/slots/${slotId}/complete`);
  },
};

