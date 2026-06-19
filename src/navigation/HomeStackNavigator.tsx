import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';
import { DashboardScreen } from '../features/home/DashboardScreen';
import { ExamsScreen } from '../features/exams/ExamsScreen';
import { AddExamScreen } from '../features/exams/AddExamScreen';
import { NotificationsScreen } from '../features/home/NotificationsScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Dashboard" 
      component={DashboardScreen} 
      options={{ title: 'Dashboard' }} 
    />
    <Stack.Screen 
      name="Exams" 
      component={ExamsScreen} 
      options={{ title: 'Upcoming Exams' }} 
    />
    <Stack.Screen 
      name="AddExam" 
      component={AddExamScreen} 
      options={{ title: 'Schedule Exam' }} 
    />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
  </Stack.Navigator>
);
