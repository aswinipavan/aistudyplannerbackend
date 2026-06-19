import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AITutorStackParamList } from './types';
import { ChatSessionsScreen } from '../features/ai-chat/ChatSessionsScreen';
import { ChatScreen } from '../features/ai-chat/ChatScreen';

const Stack = createNativeStackNavigator<AITutorStackParamList>();

export const AITutorStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="ChatSessions" component={ChatSessionsScreen} />
    <Stack.Screen name="Chat" component={ChatScreen} />
  </Stack.Navigator>
);
