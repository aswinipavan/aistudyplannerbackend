import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { useTheme } from '../../theme/useTheme';

export const OfflineBanner = () => {
  const { isConnected, isInternetReachable } = useNetInfo();
  const { theme, typography } = useTheme();

  if (isConnected === false || isInternetReachable === false) {
    return (
      <SafeAreaView style={{ backgroundColor: theme.warning }}>
        <View style={[styles.container, { backgroundColor: theme.warning }]}>
          <Text style={[typography.caption, { color: '#000', fontWeight: 'bold' }]}>
            You are currently offline. Showing cached data.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  }
});
