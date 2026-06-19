import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '../../navigation/types';
import { Theme } from '../../theme';
import { useAuthStore } from '../../store/authStore';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { signInWithGoogle } = useAuthStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '217274229428-70ihbsrjg60cc4hld7ktskg3h999jqo5.apps.googleusercontent.com', 
    });
  }, []);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      // Navigation is handled automatically by RootNavigator when isAuthenticated changes
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available or outdated');
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subtitle}>Use your Google account to continue.</Text>
      
      <TouchableOpacity 
        style={styles.googleButton}
        onPress={handleGoogleSignIn}
        disabled={loading}
      >
        {loading ? (
           <ActivityIndicator color={Theme.light.colors.primary} />
        ) : (
           <Text style={styles.googleButtonText}>Sign in with Google</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.light.colors.background, padding: Theme.light.spacing.lg, justifyContent: 'center' },
  title: { ...Theme.light.typography.h1, color: Theme.light.colors.text, marginBottom: Theme.light.spacing.sm },
  subtitle: { ...Theme.light.typography.body, color: Theme.light.colors.textSecondary, marginBottom: Theme.light.spacing.xxl },
  googleButton: {
    backgroundColor: Theme.light.colors.surface,
    borderColor: Theme.light.colors.border,
    borderWidth: 1,
    padding: Theme.light.spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  googleButtonText: { ...Theme.light.typography.h3, color: Theme.light.colors.text }
});
