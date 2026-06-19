import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/useTheme';

interface AppTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'small';
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'white';
}

export const AppText: React.FC<AppTextProps> = ({ 
  children, 
  variant = 'body', 
  color = 'primary', 
  style, 
  ...props 
}) => {
  const { theme, typography } = useTheme();

  const getTextColor = () => {
    switch (color) {
      case 'secondary': return theme.text.secondary;
      case 'error': return theme.error;
      case 'success': return theme.success;
      case 'white': return '#FFFFFF';
      case 'primary':
      default:
        return theme.text.primary;
    }
  };

  return (
    <Text
      style={[
        typography[variant],
        { color: getTextColor() },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};
