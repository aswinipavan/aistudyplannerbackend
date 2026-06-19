import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppButton } from './AppButton';
import { useTheme } from '../../theme/useTheme';

export const ErrorState = ({ onRetry, message = 'Something went wrong' }: { onRetry: () => void, message?: string }) => {
  const { theme, typography } = useTheme();

  return (
    <View style={styles.center}>
      <Text style={[typography.body, { color: theme.error, marginBottom: 16 }]}>{message}</Text>
      <AppButton label="Try Again" onPress={onRetry} variant="outline" />
    </View>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }
});
