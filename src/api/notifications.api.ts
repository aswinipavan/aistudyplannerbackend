import { apiClient } from './client';

export const notificationsApi = {
  /**
   * Sends the FCM device token to the backend so the server can send
   * push notifications to this device.
   * Backend endpoint: POST /api/notifications/fcm-token
   */
  registerFcmToken: async (token: string): Promise<void> => {
    await apiClient.post<any>('/api/notifications/fcm-token', { fcmToken: token });
  },
};
