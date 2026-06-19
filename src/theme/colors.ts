export const lightColors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  primary: '#4F46E5',
  secondary: '#10B981',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  error: '#EF4444',
};

export const darkColors = {
  background: '#111827',
  surface: '#1F2937',
  primary: '#6366F1',
  secondary: '#34D399',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  border: '#374151',
  error: '#F87171',
};

export const lightTheme = {
  background: '#FFFFFF',
  surface: '#F4F6F9',
  primary: '#1E2A5E',
  accent: '#00A896',
  text: { primary: '#1A1A2E', secondary: '#6B7280' },
  border: '#CBD5E1',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
};

export const darkTheme = {
  background: '#0F172A',
  surface: '#1E293B',
  primary: '#60A5FA',
  accent: '#34D399',
  text: { primary: '#F1F5F9', secondary: '#94A3B8' },
  border: '#334155',
  success: '#34D399',
  error: '#F87171',
  warning: '#FCD34D',
};

export type Colors = typeof lightColors;
export type ThemeColors = typeof lightTheme;
