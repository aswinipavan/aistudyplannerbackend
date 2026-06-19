import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';

// @ts-ignore
const storage = new MMKV();
const THEME_KEY = 'APP_THEME_PREFERENCE';

export type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeState {
  themePreference: ThemePreference;
  setThemePreference: (pref: ThemePreference) => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  themePreference: 'system',

  initializeTheme: () => {
    const saved = storage.getString(THEME_KEY) as ThemePreference;
    if (saved) {
      set({ themePreference: saved });
    }
  },

  setThemePreference: (pref) => {
    storage.set(THEME_KEY, pref);
    set({ themePreference: pref });
  }
}));
