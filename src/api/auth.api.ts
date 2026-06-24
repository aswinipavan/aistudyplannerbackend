import { apiClient } from './client';
import { StudentProfile } from '../types/api.types';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: StudentProfile;
}

export const authApi = {
  login: async (firebaseToken: string): Promise<LoginResponse> => {
    const response = await apiClient.post<any>('/api/auth/login', { firebaseToken });
    const authData = response.data.data;
    
    return {
      accessToken: authData.token,
      refreshToken: authData.token, // Fallback since JWT is handled via Firebase on mobile client
      user: {
        id: authData.student.id,
        firebaseUid: authData.student.firebaseUid,
        name: authData.student.fullName || '',
        email: authData.student.email || '',
        photoUrl: authData.student.profilePictureUrl,
        isPremium: !!authData.student.isPremium,
        createdAt: new Date().toISOString(),
        isNewUser: authData.isNewUser
      }
    };
  },

  getMe: async (): Promise<StudentProfile> => {
    const response = await apiClient.get<any>('/api/students/me');
    const student = response.data.data;
    
    return {
      id: student.id,
      firebaseUid: student.firebaseUid,
      name: student.fullName || '',
      email: student.email || '',
      photoUrl: student.profilePictureUrl,
      isPremium: !!student.isPremium,
      createdAt: new Date().toISOString(),
      isNewUser: false
    };
  }
};
