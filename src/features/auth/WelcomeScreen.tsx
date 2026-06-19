import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/useTheme';
import { AppText } from '../../components/common/AppText';
import { AppButton } from '../../components/common/AppButton';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

export const WelcomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { theme, spacing } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background, padding: spacing.lg }]}>
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(1000).springify()}>
          <AppText variant="h1" style={{ textAlign: 'center', marginBottom: spacing.md }}>
            Welcome to AI Study Planner
          </AppText>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(300).duration(1000).springify()}>
          <AppText variant="body" color="secondary" style={{ textAlign: 'center' }}>
            Supercharge your learning with AI.
          </AppText>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.delay(600).duration(800).springify()}>
        <AppButton 
          label="Get Started" 
          onPress={() => navigation.navigate('Login')}
          style={{ marginBottom: spacing.xl }}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
