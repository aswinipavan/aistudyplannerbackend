import { apiClient } from './client';
import { ChatMessage } from '../types/api.types';
import { MMKV } from 'react-native-mmkv';

// @ts-ignore
const storage = new MMKV({ id: 'chat-storage' });
const GROQ_API_KEY = process.env.GROQ_API_KEY || 'replace_with_your_groq_api_key';

export interface ChatSession {
  id: string;
  title: string;
  lastMessage?: string;
  createdAt: string;
}

export const chatApi = {
  getHistory: async (sessionId: string): Promise<ChatMessage[]> => {
    try {
      const historyJson = storage.getString(`chat_history_${sessionId}`);
      if (historyJson) {
        return JSON.parse(historyJson);
      }
    } catch (e) {
      console.warn("Failed to load local chat history", e);
    }
    
    // Fallback to backend history if not found locally
    try {
      const response = await apiClient.get<any>('/api/ai/chat/history', { params: { sessionId } });
      const history = response.data.data || [];
      const formatted = history.map((item: any) => ({
        id: item.id,
        role: item.role,
        content: item.message,
        sessionId: item.sessionId,
        timestamp: item.createdAt || new Date().toISOString()
      }));
      // Cache it locally
      storage.set(`chat_history_${sessionId}`, JSON.stringify(formatted));
      return formatted;
    } catch {
      return [];
    }
  },

  sendMessage: async (content: string, sessionId: string, history: ChatMessage[] = []): Promise<{ message: ChatMessage, sessionId: string }> => {
    const systemPrompt = {
      role: 'system',
      content: 'You are an expert AI Study Planner and Tutor. Provide concise, actionable, and formatted markdown responses to help the student excel.'
    };

    const messages = [
      systemPrompt,
      ...history.map(msg => ({ role: msg.role, content: msg.content })),
      { role: 'user', content }
    ];

    let reply = "I'm sorry, I couldn't process that request.";

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages,
          temperature: 0.7,
        })
      });
      
      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        reply = data.choices[0].message.content;
      } else if (data.error) {
        console.error("Groq API Error:", data.error);
        reply = `API Error: ${data.error.message || 'Unknown error'}`;
      }
    } catch (error) {
      console.error("Groq fetch error:", error);
      reply = "Network error connecting to Groq AI.";
    }

    const aiMessage: ChatMessage = {
      id: `ai-${Date.now()}`,
      role: 'assistant',
      content: reply,
      sessionId,
      timestamp: new Date().toISOString()
    };

    // Save to local MMKV storage
    try {
      const newHistory = [...history, { id: `usr-${Date.now()}`, role: 'user', content, sessionId, timestamp: new Date().toISOString() }, aiMessage];
      storage.set(`chat_history_${sessionId}`, JSON.stringify(newHistory));
      
      // Also save session overview
      const sessionsJson = storage.getString('chat_sessions');
      let sessions: ChatSession[] = sessionsJson ? JSON.parse(sessionsJson) : [];
      if (!sessions.find(s => s.id === sessionId)) {
        sessions.unshift({ id: sessionId, title: content.substring(0, 30) + '...', createdAt: new Date().toISOString(), lastMessage: reply.substring(0, 50) });
      } else {
        sessions = sessions.map(s => s.id === sessionId ? { ...s, lastMessage: reply.substring(0, 50) } : s);
      }
      storage.set('chat_sessions', JSON.stringify(sessions));

    } catch (e) {
      console.warn("Failed to save local chat history", e);
    }

    return {
      message: aiMessage,
      sessionId
    };
  },

  getSessions: async (): Promise<ChatSession[]> => {
    try {
      const sessionsJson = storage.getString('chat_sessions');
      if (sessionsJson) {
        return JSON.parse(sessionsJson);
      }
      
      // Fallback to backend
      const response = await apiClient.get<any>('/api/ai/chat/sessions');
      const sessions = response.data.data || [];
      const formatted = sessions.map((s: any) => ({
        id: s.sessionId || s.id,
        title: s.title || s.firstMessage || 'Chat Session',
        lastMessage: s.lastMessage || '',
        createdAt: s.createdAt || new Date().toISOString(),
      }));
      storage.set('chat_sessions', JSON.stringify(formatted));
      return formatted;
    } catch {
      return [];
    }
  },
};
