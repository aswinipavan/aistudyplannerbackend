import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { MainTabNavigator } from './MainTabNavigator';
import { AuthNavigator } from './AuthNavigator';
import { useAuthStore } from '../store/authStore';
import { SplashScreen } from '../features/auth/SplashScreen';
import { OfflineBanner } from '../components/common/OfflineBanner';
import { ToastManager } from '../components/common/ToastManager';
import { usePushNotifications } from '../features/notifications/hooks/usePushNotifications';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { isAuthenticated, isLoading, initialize } = useAuthStore();
  
  // Setup global push notifications
  usePushNotifications();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <>
      <OfflineBanner />
      <ToastManager />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <Stack.Screen name="Main" component={MainTabNavigator} />
          ) : (
            <Stack.Screen name="Auth" component={AuthNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};
