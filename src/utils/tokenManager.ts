import { MMKV } from 'react-native-mmkv';

// We use an environment variable for the encryption key, falling back to a default for local dev
const ENCRYPTION_KEY = process.env.FIREBASE_API_KEY || 'default-dev-encryption-key-12345';

// @ts-ignore
const storage = new MMKV({
  id: 'secure-token-storage',
  encryptionKey: ENCRYPTION_KEY
});
const TOKEN_KEY = 'AUTH_TOKEN';
const REFRESH_TOKEN_KEY = 'REFRESH_TOKEN';

export const tokenManager = {
  // Sync version for Splash screen
  getToken: (): string | undefined => {
    return storage.getString(TOKEN_KEY);
  },
  // Async version for Axios interceptor
  getAccessToken: async (): Promise<string | undefined> => {
    return storage.getString(TOKEN_KEY);
  },
  storeTokens: async (token: string, refreshToken?: string) => {
    storage.set(TOKEN_KEY, token);
    if (refreshToken) {
      storage.set(REFRESH_TOKEN_KEY, refreshToken);
    }
  },
  clearTokens: async () => {
    storage.delete(TOKEN_KEY);
    storage.delete(REFRESH_TOKEN_KEY);
  },
  refreshToken: async (): Promise<string | null> => {
    // Simulating token refresh
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAccessToken = "refreshed_mock_jwt_token_12345";
        storage.set(TOKEN_KEY, newAccessToken);
        resolve(newAccessToken);
      }, 500);
    });
  }
};
