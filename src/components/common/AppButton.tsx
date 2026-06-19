import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { useTheme } from '../../theme/useTheme';

interface AppButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'outline' | 'ghost';
  loading?: boolean;
}

export const AppButton = ({ label, variant = 'primary', loading, disabled, style, ...props }: AppButtonProps) => {
  const { theme, typography } = useTheme();

  const getContainerStyle = () => {
    switch (variant) {
      case 'outline': return { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.primary };
      case 'ghost': return { backgroundColor: 'transparent' };
      default: return { backgroundColor: theme.primary };
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
      case 'ghost': return { color: theme.primary };
      default: return { color: '#FFFFFF' };
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.button, getContainerStyle(), (disabled || loading) && styles.disabled, style]} 
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextStyle().color} />
      ) : (
        <Text style={[typography.h3, getTextStyle()]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.6 },
});
