import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from './types';
import { ProfileScreen } from '../features/profile/ProfileScreen';
import { ExamsScreen } from '../features/profile/ExamsScreen';
import { PerformanceScreen } from '../features/performance/PerformanceScreen';
import { AddMarkScreen } from '../features/performance/AddMarkScreen';
import { PriorityScreen } from '../features/profile/PriorityScreen';
import { SubscriptionScreen } from '../features/profile/SubscriptionScreen';
import { SettingsScreen } from '../features/profile/SettingsScreen';

import { AnalyticsScreen } from '../features/performance/AnalyticsScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="ProfileHome" component={ProfileScreen} />
    <Stack.Screen name="Exams" component={ExamsScreen} />
    <Stack.Screen name="Performance" component={PerformanceScreen} />
    <Stack.Screen name="Analytics" component={AnalyticsScreen} options={{ title: 'Advanced Analytics' }} />
    <Stack.Screen name="AddMark" component={AddMarkScreen} options={{ title: 'Add Test Score' }} />
    <Stack.Screen name="Priority" component={PriorityScreen} />
    <Stack.Screen name="Subscription" component={SubscriptionScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
  </Stack.Navigator>
);
