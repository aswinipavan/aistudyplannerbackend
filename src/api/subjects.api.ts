import { apiClient } from './client';
import { Subject, CreateSubjectDTO } from '../types/api.types';

export const subjectsApi = {
  getAll: async () => {
    const response = await apiClient.get<Subject[]>('/api/students/me/subjects');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get<Subject>(`/api/students/me/subjects/${id}`);
    return response.data;
  },
  create: async (data: CreateSubjectDTO) => {
    const response = await apiClient.post<Subject>('/api/students/me/subjects', data);
    return response.data;
  },
  update: async (id: string, data: Partial<CreateSubjectDTO>) => {
    const response = await apiClient.put<Subject>(`/api/students/me/subjects/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/api/students/me/subjects/${id}`);
    return response.data;
  }
};
