import { apiClient } from './client';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
    user: {
      id: string;
      email: string;
      name: string;
      isNewUser: boolean;
      firebaseUid: string;
      isPremium: boolean;
      createdAt: string;
    };
}

export const authApi = {
  login: async (firebaseToken: string): Promise<LoginResponse> => {
    // Simulating backend logic for now to unblock UI development
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          accessToken: 'mock_access_token_123',
          refreshToken: 'mock_refresh_token_456',
          user: {
            id: 'u1',
            email: 'student@example.com',
            name: 'John Doe',
            isNewUser: false,
            firebaseUid: 'mock_fb_uid',
            isPremium: true,
            createdAt: '2023-01-01'
          }
        });
      }, 1000);
    });
  },
  getMe: async (): Promise<any> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'u1',
          email: 'student@example.com',
          name: 'John Doe',
          isNewUser: false,
          firebaseUid: 'mock_fb_uid',
          isPremium: true,
          createdAt: '2023-01-01'
        });
      }, 500);
    });
  }
};
