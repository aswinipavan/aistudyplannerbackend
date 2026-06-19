import { create } from 'zustand';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { authApi } from '../api/auth.api';
import { tokenManager } from '../utils/tokenManager';
import { StudentProfile } from '../types/api.types';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: StudentProfile | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  completeOnboarding: (data: any) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  user: null,

  initialize: async () => {
    const token = await tokenManager.getAccessToken();
    if (token) {
      try {
        const user = await authApi.getMe();
        set({ isAuthenticated: true, user, isLoading: false });
      } catch (e) {
        set({ isAuthenticated: false, isLoading: false });
      }
    } else {
      set({ isAuthenticated: false, isLoading: false });
    }
  },

  signInWithGoogle: async () => {
    set({ isLoading: true });
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { data } = await GoogleSignin.signIn();
      const idToken = data?.idToken;

      if (!idToken) throw new Error("No ID Token found");

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);

      const { accessToken, refreshToken, user } = await authApi.login(idToken);
      await tokenManager.storeTokens(accessToken, refreshToken);
      
      set({ isAuthenticated: true, user, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false, isAuthenticated: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await auth().signOut();
      await GoogleSignin.signOut();
      await tokenManager.clearTokens();
      set({ isAuthenticated: false, user: null, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },

  completeOnboarding: (data: any) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...data, isNewUser: false } : null
    }));
  }
}));
