export const notificationsApi = {
  registerFcmToken: async (token: string): Promise<void> => {
    // Mock successful registration with the backend
    console.log('[notifications.api.ts] Registered FCM token with backend:', token);
    await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
  },
};
