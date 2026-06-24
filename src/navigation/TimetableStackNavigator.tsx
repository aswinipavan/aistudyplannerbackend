import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TimetableStackParamList } from './types';
import { TimetableScreen } from '../features/timetable/TimetableScreen';
import { GenerateTimetableScreen } from '../features/timetable/GenerateTimetableScreen';
import { StudySlotDetailScreen } from '../features/timetable/StudySlotDetailScreen';
import { StudyTimerScreen } from '../features/timetable/StudyTimerScreen';

const Stack = createNativeStackNavigator<TimetableStackParamList>();

export const TimetableStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="TimetableList" component={TimetableScreen} />
    <Stack.Screen name="GenerateTimetable" component={GenerateTimetableScreen} />
    <Stack.Screen name="StudySlotDetail" component={StudySlotDetailScreen} />
    <Stack.Screen name="StudyTimer" component={StudyTimerScreen} options={{ title: 'Study Timer' }} />
  </Stack.Navigator>
);
