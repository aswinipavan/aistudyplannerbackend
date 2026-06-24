import { apiClient } from './client';
import { Exam } from '../types/api.types';

const mapBackendExam = (backendExam: any): Exam => {
  return {
    id: backendExam.id,
    subjectId: backendExam.subject?.id || '',
    subject: backendExam.subject ? {
      id: backendExam.subject.id,
      name: backendExam.subject.subjectName,
      color: backendExam.subject.color || '#2196F3',
      icon: backendExam.subject.icon || 'book',
      studentId: ''
    } : undefined,
    examDate: backendExam.examDate,
    difficulty: backendExam.examType === 'hard' ? 'hard' : backendExam.examType === 'medium' ? 'medium' : 'easy',
    notes: backendExam.syllabusCovered || ''
  };
};

export const examsApi = {
  getAll: async (): Promise<Exam[]> => {
    const response = await apiClient.get<any>('/api/exams/');
    const list = response.data.data || [];
    return list.map(mapBackendExam);
  },
  getById: async (id: string): Promise<Exam> => {
    const response = await apiClient.get<any>(`/api/exams/${id}`);
    return mapBackendExam(response.data.data);
  },
  create: async (data: Omit<Exam, 'id'>): Promise<Exam> => {
    const dateStr = data.examDate.split('T')[0];
    const response = await apiClient.post<any>('/api/exams/', {
      subjectId: data.subjectId,
      examName: "Course Exam",
      examDate: dateStr,
      examType: data.difficulty,
      durationHours: 2.0,
      syllabusCovered: data.notes || ''
    });
    return mapBackendExam(response.data.data);
  },
  update: async (id: string, data: Partial<Omit<Exam, 'id'>>): Promise<Exam> => {
    const payload: any = {};
    if (data.subjectId) payload.subjectId = data.subjectId;
    if (data.examDate) payload.examDate = data.examDate.split('T')[0];
    if (data.difficulty) payload.examType = data.difficulty;
    if (data.notes) payload.syllabusCovered = data.notes;
    payload.examName = "Course Exam";
    payload.durationHours = 2.0;

    const response = await apiClient.put<any>(`/api/exams/${id}`, payload);
    return mapBackendExam(response.data.data);
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/exams/${id}`);
  }
};

