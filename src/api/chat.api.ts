import { ChatMessage } from '../types/api.types';

export const chatApi = {
  getHistory: async (sessionId: string): Promise<ChatMessage[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'msg-1',
            role: 'assistant',
            content: "Hi there! I'm your AI Study Tutor. Ask me anything about your subjects.",
            sessionId: sessionId,
            timestamp: new Date().toISOString()
          }
        ]);
      }, 500);
    });
  },

  sendMessage: async (content: string, sessionId: string): Promise<{ message: ChatMessage, sessionId: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          message: {
            id: `msg-${Date.now()}`,
            role: 'assistant',
            content: `This is a simulated response to: "${content}"`,
            sessionId: sessionId,
            timestamp: new Date().toISOString()
          },
          sessionId: sessionId
        });
      }, 1500); // Simulate thinking delay
    });
  }
};
