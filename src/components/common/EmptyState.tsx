import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { AppText } from './AppText';
import { AppButton } from './AppButton';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, actionLabel, onAction }) => {
  const { spacing } = useTheme();

  return (
    <View style={[styles.container, { padding: spacing.xl }]}>
      <AppText variant="h2" style={{ marginBottom: spacing.sm, textAlign: 'center' }}>
        {title}
      </AppText>
      <AppText variant="body" color="secondary" style={{ textAlign: 'center', marginBottom: spacing.xl }}>
        {description}
      </AppText>
      {actionLabel && onAction && (
        <AppButton label={actionLabel} onPress={onAction} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
