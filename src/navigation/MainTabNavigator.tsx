import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { HomeStackNavigator } from './HomeStackNavigator';
import { TimetableStackNavigator } from './TimetableStackNavigator';
import { SubjectsStackNavigator } from './SubjectsStackNavigator';
import { AITutorStackNavigator } from './AITutorStackNavigator';
import { ProfileStackNavigator } from './ProfileStackNavigator';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="HomeStack" component={HomeStackNavigator} options={{ title: 'Home' }} />
      <Tab.Screen name="TimetableStack" component={TimetableStackNavigator} options={{ title: 'Timetable' }} />
      <Tab.Screen name="SubjectsStack" component={SubjectsStackNavigator} options={{ title: 'Subjects' }} />
      <Tab.Screen name="AITutorStack" component={AITutorStackNavigator} options={{ title: 'AI Tutor' }} />
      <Tab.Screen name="ProfileStack" component={ProfileStackNavigator} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};
