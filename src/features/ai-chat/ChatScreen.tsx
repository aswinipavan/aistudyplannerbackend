import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Theme } from '../../theme';
import { chatApi } from '../../api/chat.api';
import { ChatMessage } from '../../types/api.types';
import { AITutorStackParamList } from '../../navigation/types';

type ChatRoute = RouteProp<AITutorStackParamList, 'Chat'>;

const TypingIndicator = () => {
  return (
    <View style={styles.typingContainer}>
      <Text style={styles.typingText}>AI is typing...</Text>
    </View>
  );
};

export const ChatScreen = () => {
  const route = useRoute<ChatRoute>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  // Use sessionId from navigation params; backend may return a canonical ID on first message
  const [sessionId, setSessionId] = useState(route.params.sessionId);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const history = await chatApi.getHistory(sessionId);
      setMessages(history);
    };
    fetchHistory();
  }, [sessionId]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: inputText,
      sessionId,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);
    
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const res = await chatApi.sendMessage(userMsg.content, sessionId, messages);
      setMessages(prev => [...prev, res.message]);
      // Sync to backend's canonical session ID (in case it assigned a new one)
      if (res.sessionId && res.sessionId !== sessionId) {
        setSessionId(res.sessionId);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsThinking(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
        <Text style={[styles.messageText, isUser ? styles.userText : styles.aiText]}>
          {item.content}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={<Text style={styles.emptyText}>Ask me anything about your studies!</Text>}
      />

      {isThinking && <TypingIndicator />}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor={Theme.light.colors.textSecondary}
          multiline
          maxLength={800}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={isThinking || !inputText.trim()}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
      {inputText.length > 750 && (
        <Text style={styles.charLimitWarning}>{800 - inputText.length} characters left</Text>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.light.colors.background,
  },
  listContent: {
    padding: Theme.light.spacing.md,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  emptyText: {
    ...Theme.light.typography.body,
    color: Theme.light.colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: Theme.light.spacing.md,
    borderRadius: 16,
    marginBottom: Theme.light.spacing.sm,
  },
  userBubble: {
    backgroundColor: Theme.light.colors.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: Theme.light.colors.surface,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Theme.light.colors.border,
  },
  messageText: {
    ...Theme.light.typography.body,
  },
  userText: {
    color: Theme.light.colors.surface,
  },
  aiText: {
    color: Theme.light.colors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: Theme.light.spacing.md,
    backgroundColor: Theme.light.colors.surface,
    borderTopWidth: 1,
    borderTopColor: Theme.light.colors.border,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: Theme.light.colors.background,
    borderRadius: 20,
    paddingHorizontal: Theme.light.spacing.md,
    paddingTop: Theme.light.spacing.sm,
    paddingBottom: Theme.light.spacing.sm,
    maxHeight: 100,
    minHeight: 40,
    color: Theme.light.colors.text,
  },
  sendButton: {
    marginLeft: Theme.light.spacing.md,
    marginBottom: Theme.light.spacing.sm,
    backgroundColor: Theme.light.colors.primary,
    paddingHorizontal: Theme.light.spacing.md,
    paddingVertical: Theme.light.spacing.sm,
    borderRadius: 20,
  },
  sendButtonText: {
    color: Theme.light.colors.surface,
    fontWeight: 'bold',
  },
  typingContainer: {
    padding: Theme.light.spacing.md,
    alignSelf: 'flex-start',
  },
  typingText: {
    color: Theme.light.colors.textSecondary,
    fontStyle: 'italic',
  },
  charLimitWarning: {
    color: Theme.light.colors.error,
    fontSize: 12,
    textAlign: 'right',
    paddingRight: Theme.light.spacing.md,
    paddingBottom: Theme.light.spacing.sm,
    backgroundColor: Theme.light.colors.surface,
  }
});
