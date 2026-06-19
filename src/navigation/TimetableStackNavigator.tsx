import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TimetableStackParamList } from './types';
import { TimetableScreen } from '../features/timetable/TimetableScreen';
import { GenerateTimetableScreen } from '../features/timetable/GenerateTimetableScreen';
import { StudySlotDetailScreen } from '../features/timetable/StudySlotDetailScreen';

const Stack = createNativeStackNavigator<TimetableStackParamList>();

export const TimetableStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="TimetableList" component={TimetableScreen} />
    <Stack.Screen name="GenerateTimetable" component={GenerateTimetableScreen} />
    <Stack.Screen name="StudySlotDetail" component={StudySlotDetailScreen} />
  </Stack.Navigator>
);
