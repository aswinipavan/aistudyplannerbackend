import { useColorScheme } from 'react-native';
import { useThemeStore } from '../store/themeStore';
import { lightTheme, darkTheme } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

export const useTheme = () => {
  const { themePreference } = useThemeStore();
  const systemColorScheme = useColorScheme();

  const isDark = 
    themePreference === 'dark' || 
    (themePreference === 'system' && systemColorScheme === 'dark');

  const activeColors = isDark ? darkTheme : lightTheme;

  return {
    theme: activeColors,
    typography,
    spacing,
    isDark
  };
};
