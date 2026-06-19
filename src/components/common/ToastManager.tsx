import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useTheme } from '../../theme/useTheme';
import { AppText } from './AppText';
import { useToastStore, Toast } from '../../store/toastStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ToastItem = ({ toast }: { toast: Toast }) => {
  const { theme, spacing } = useTheme();
  const { removeToast } = useToastStore();

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success': return theme.success;
      case 'error': return theme.error;
      case 'info':
      default:
        return theme.primary;
    }
  };

  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      style={[
        styles.toastItem,
        { backgroundColor: getBackgroundColor(), marginHorizontal: spacing.md, marginBottom: spacing.sm }
      ]}
    >
      <TouchableOpacity onPress={() => removeToast(toast.id)} style={{ padding: spacing.md }}>
        <AppText variant="body" color="white">{toast.message}</AppText>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const ToastManager = () => {
  const { toasts } = useToastStore();
  const insets = useSafeAreaInsets();

  if (toasts.length === 0) return null;

  return (
    <View style={[styles.container, { top: insets.top + 10 }]} pointerEvents="box-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  toastItem: {
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  }
});
