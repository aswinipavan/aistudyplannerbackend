import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { tokenManager } from '../../utils/tokenManager';
import { Theme } from '../../theme';

export const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Study Planner</Text>
      <ActivityIndicator size="large" color={Theme.light.colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.light.colors.background,
  },
  title: {
    ...Theme.light.typography.h1,
    color: Theme.light.colors.primary,
    marginBottom: Theme.light.spacing.xl,
  }
});
