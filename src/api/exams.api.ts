import { apiClient } from './client';
import { Exam } from '../types/api.types';

export const examsApi = {
  getAll: async () => {
    const response = await apiClient.get<Exam[]>('/api/students/me/exams');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get<Exam>(`/api/students/me/exams/${id}`);
    return response.data;
  },
  create: async (data: Omit<Exam, 'id'>) => {
    const response = await apiClient.post<Exam>('/api/students/me/exams', data);
    return response.data;
  },
  update: async (id: string, data: Partial<Omit<Exam, 'id'>>) => {
    const response = await apiClient.put<Exam>(`/api/students/me/exams/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/api/students/me/exams/${id}`);
    return response.data;
  }
};
