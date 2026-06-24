import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MMKV } from 'react-native-mmkv';
import { AITutorStackParamList } from '../../navigation/types';
import { Theme } from '../../theme';
import { AppText } from '../../components/common/AppText';
import { AppButton } from '../../components/common/AppButton';
import { chatApi, ChatSession } from '../../api/chat.api';

// Persistent local session store — survives app restarts
// @ts-ignore
const sessionStorage = new MMKV({ id: 'chat-sessions' });
const LOCAL_SESSIONS_KEY = 'local_sessions';

const generateSessionId = (): string =>
  `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

const getLocalSessions = (): ChatSession[] => {
  try {
    const raw = sessionStorage.getString(LOCAL_SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalSession = (session: ChatSession) => {
  const existing = getLocalSessions();
  const updated = [session, ...existing.filter(s => s.id !== session.id)];
  sessionStorage.set(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
};

const SESSIONS_QUERY_KEY = ['chat', 'sessions'];

export const ChatSessionsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AITutorStackParamList, 'ChatSessions'>>();
  const qc = useQueryClient();

  // Fetch sessions from backend, merge with locally stored ones
  const { data: sessions, isLoading } = useQuery({
    queryKey: SESSIONS_QUERY_KEY,
    queryFn: async (): Promise<ChatSession[]> => {
      const [backendSessions, localSessions] = await Promise.all([
        chatApi.getSessions(),
        Promise.resolve(getLocalSessions()),
      ]);
      // Merge: backend takes precedence, local fills the gap
      const merged = new Map<string, ChatSession>();
      localSessions.forEach(s => merged.set(s.id, s));
      backendSessions.forEach(s => merged.set(s.id, s));
      return Array.from(merged.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    },
  });

  const handleStartNewChat = useCallback(() => {
    const newSession: ChatSession = {
      id: generateSessionId(),
      title: 'New Chat',
      createdAt: new Date().toISOString(),
    };
    // Persist locally so it appears in the list immediately
    saveLocalSession(newSession);
    qc.invalidateQueries({ queryKey: SESSIONS_QUERY_KEY });
    navigation.navigate('Chat', { sessionId: newSession.id });
  }, [navigation, qc]);

  const handleOpenSession = useCallback((session: ChatSession) => {
    navigation.navigate('Chat', { sessionId: session.id });
  }, [navigation]);

  const formatDate = (iso: string): string => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={sessions || []}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: Theme.light.spacing.lg, paddingBottom: 100 }}
        ListHeaderComponent={
          <View style={styles.header}>
            <AppText variant="h1" style={{ marginBottom: Theme.light.spacing.sm }}>AI Tutor Sessions</AppText>
            <AppText variant="body" color="secondary">Review your past conversations or start a new one.</AppText>
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator color={Theme.light.colors.primary} style={{ marginTop: 40 }} />
          ) : (
            <AppText variant="body" color="secondary" style={{ textAlign: 'center', marginTop: 40 }}>
              No sessions yet. Start your first chat!
            </AppText>
          )
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.sessionCard}
            onPress={() => handleOpenSession(item)}
          >
            <View>
              <AppText variant="h3">{item.title}</AppText>
              {item.lastMessage ? (
                <AppText variant="caption" color="secondary" style={{ marginTop: 2 }} numberOfLines={1}>
                  {item.lastMessage}
                </AppText>
              ) : null}
              <AppText variant="caption" color="secondary" style={{ marginTop: 4 }}>
                {formatDate(item.createdAt)}
              </AppText>
            </View>
            <AppText variant="h3" color="primary">→</AppText>
          </TouchableOpacity>
        )}
      />

      <View style={styles.fabContainer}>
        <AppButton
          label="+ Start New Chat"
          onPress={handleStartNewChat}
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
