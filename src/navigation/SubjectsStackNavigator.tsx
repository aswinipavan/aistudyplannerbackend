import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SubjectsStackParamList } from './types';
import { SubjectsListScreen } from '../features/subjects/SubjectsListScreen';
import { SubjectDetailScreen } from '../features/subjects/SubjectDetailScreen';
import { AddSubjectScreen } from '../features/subjects/AddSubjectScreen';
import { MaterialsScreen } from '../features/materials/MaterialsScreen';

const Stack = createNativeStackNavigator<SubjectsStackParamList>();

export const SubjectsStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="SubjectsList" component={SubjectsListScreen} />
    <Stack.Screen name="SubjectDetail" component={SubjectDetailScreen} />
    <Stack.Screen name="AddSubject" component={AddSubjectScreen} />
    <Stack.Screen name="Materials" component={MaterialsScreen} />
  </Stack.Navigator>
);
