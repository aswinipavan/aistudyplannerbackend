import { apiClient } from './client';

export interface StudentProfileData {
  name: string;
  grade: string;
  examBoard: string;
}

export const studentsApi = {
  updateProfile: async (data: StudentProfileData) => {
    // return apiClient.put('/students/me', data).then(res => res.data);
    
    // Mock implementation for UI flow testing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data });
      }, 1000);
    });
  }
};
