import { lightColors, darkColors, Colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

export const Theme = {
  light: {
    colors: lightColors,
    typography,
    spacing,
  },
  dark: {
    colors: darkColors,
    typography,
    spacing,
  },
};

export type AppTheme = typeof Theme.light;
export { lightColors, darkColors, typography, spacing };
