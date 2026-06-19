import React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AITutorStackParamList } from '../../navigation/types';
import { Theme } from '../../theme';
import { AppText } from '../../components/common/AppText';
import { AppButton } from '../../components/common/AppButton';

const MOCK_SESSIONS = [
  { id: '1', title: 'Math Help: Calculus Concepts', date: 'Today' },
  { id: '2', title: 'Physics: Kinematics Review', date: 'Yesterday' },
  { id: '3', title: 'History Essay Outline', date: 'Last Week' },
];

export const ChatSessionsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AITutorStackParamList, 'ChatSessions'>>();

  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_SESSIONS}
        contentContainerStyle={{ padding: Theme.light.spacing.lg }}
        ListHeaderComponent={
          <View style={styles.header}>
            <AppText variant="h1" style={{ marginBottom: Theme.light.spacing.sm }}>AI Tutor Sessions</AppText>
            <AppText variant="body" color="secondary">Review your past conversations or start a new one.</AppText>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.sessionCard}
            onPress={() => navigation.navigate('Chat')}
          >
            <View>
              <AppText variant="h3">{item.title}</AppText>
              <AppText variant="caption" color="secondary" style={{ marginTop: 4 }}>{item.date}</AppText>
            </View>
            <AppText variant="h3" color="primary">→</AppText>
          </TouchableOpacity>
        )}
      />
      
      <View style={styles.fabContainer}>
        <AppButton 
          label="+ Start New Chat" 
          onPress={() => navigation.navigate('Chat')} 
          style={{ borderRadius: 25, elevation: 5, shadowOpacity: 0.2, shadowOffset: { width: 0, height: 4 }, shadowRadius: 5 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.light.colors.background },
  header: { marginBottom: Theme.light.spacing.xl },
  sessionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Theme.light.colors.surface,
    padding: Theme.light.spacing.md,
    borderRadius: 12,
    marginBottom: Theme.light.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  fabContainer: {
    position: 'absolute',
    bottom: Theme.light.spacing.xl,
    left: Theme.light.spacing.lg,
    right: Theme.light.spacing.lg,
  }
});
