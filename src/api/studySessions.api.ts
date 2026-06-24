import { apiClient } from './client';

export interface SaveSessionDTO {
  subjectId: string;
  durationMinutes: number;
  date: string; // ISO date string e.g. "2024-01-15"
  productivityScore?: number;
  focusInterruptions?: number;
  studyMode?: string;
}

export const studySessionsApi = {
  /**
   * Persists a completed study session to the backend.
   * Backend endpoint: POST /api/study-sessions/
   */
  saveSession: async (data: SaveSessionDTO): Promise<void> => {
    await apiClient.post<any>('/api/study-sessions/', {
      subjectId: data.subjectId,
      durationMinutes: data.durationMinutes,
      date: data.date,
      productivityScore: data.productivityScore,
      focusInterruptions: data.focusInterruptions,
      studyMode: data.studyMode,
    });
  },
};
