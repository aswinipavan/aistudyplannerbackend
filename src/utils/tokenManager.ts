import { MMKV } from 'react-native-mmkv';
import auth from '@react-native-firebase/auth';

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
  /**
   * Force-refreshes the Firebase ID token. Called automatically by the Axios
   * interceptor on 401 responses.
   */
  refreshToken: async (): Promise<string | null> => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        return null;
      }
      // forceRefresh = true bypasses the Firebase client-side token cache
      const newToken = await currentUser.getIdToken(true);
      storage.set(TOKEN_KEY, newToken);
      return newToken;
    } catch (error) {
      console.error('[tokenManager] Failed to refresh Firebase token:', error);
      return null;
    }
  }
};

