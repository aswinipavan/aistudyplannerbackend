import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '../../theme/useTheme';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const AppInput = ({ label, error, style, ...props }: AppInputProps) => {
  const { theme, typography } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[typography.caption, { color: theme.text.secondary, marginBottom: 4 }]}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          typography.body,
          { 
            backgroundColor: theme.surface, 
            color: theme.text.primary,
            borderColor: error ? theme.error : theme.border 
          }
        ]}
        placeholderTextColor={theme.text.secondary}
        {...props}
      />
      {error && <Text style={[typography.caption, { color: theme.error, marginTop: 4 }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16, width: '100%' },
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12 },
});
