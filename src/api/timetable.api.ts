import { apiClient } from './client';
import { TimetableSlot } from '../types/api.types';

export interface GenerateTimetableDTO {
  availableHours: number;
  style: 'intense' | 'balanced' | 'relaxed';
  subjectIds: string[];
  startDate: string;
  durationDays: number;
}

const mapBackendSlots = (backendSlots: any[]): TimetableSlot[] => {
  const startOfWeek = new Date();
  const currentDay = startOfWeek.getDay();
  const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  startOfWeek.setDate(startOfWeek.getDate() + distanceToMonday);

  return backendSlots.map(slot => {
    const slotDate = new Date(startOfWeek);
    slotDate.setDate(startOfWeek.getDate() + (slot.dayOfWeek ?? 0));
    const dateStr = slotDate.toISOString().split('T')[0];

    return {
      id: slot.id,
      subjectId: slot.subject?.id || '',
      subject: slot.subject ? {
        id: slot.subject.id,
        name: slot.subject.subjectName,
        color: slot.subject.color || '#2196F3',
        icon: slot.subject.icon || 'book',
        studentId: ''
      } : undefined,
      startTime: slot.startTime ? slot.startTime.substring(0, 5) : '09:00',
      endTime: slot.endTime ? slot.endTime.substring(0, 5) : '10:00',
      date: dateStr,
      status: slot.isCompleted ? 'completed' : 'pending',
      timetableId: 'active-timetable'
    };
  });
};

import { performanceApi } from './performance.api';

export const timetableApi = {
  generateTimetable: async (data: GenerateTimetableDTO): Promise<TimetableSlot[]> => {
    const sessionLengthHours: Record<string, number> = {
      intense: 2,
      balanced: 1.5,
      relaxed: 1,
    };
    const sessionLen = sessionLengthHours[data.style] || 1.5;

    const sessionsPerDay = Math.max(1, Math.floor(data.availableHours / sessionLen));

    const startHour: Record<string, number> = {
      intense: 7,
      balanced: 9,
      relaxed: 10,
    };
    const baseHour = startHour[data.style] || 9;

    const slots: Array<{
      subjectId: string;
      dayOfWeek: number;
      startTime: string;
      endTime: string;
    }> = [];

    const subjectCount = data.subjectIds.length;
    if (subjectCount === 0) {
      throw new Error('At least one subject must be selected');
    }

    // 1. Fetch performance priorities for weighting
    let weightedPool: string[] = [];
    try {
      const priorities = await performanceApi.getPriorities();
      
      data.subjectIds.forEach(id => {
        const perf = priorities.find(p => p.subjectId === id);
        // Default weight is 2. Weak gets 4, Strong gets 1.
        let weight = 2;
        if (perf) {
          if (perf.status === 'Weak') weight = 4;
          else if (perf.status === 'Average') weight = 2;
          else if (perf.status === 'Strong') weight = 1;
        }
        for (let i = 0; i < weight; i++) {
          weightedPool.push(id);
        }
      });
    } catch (e) {
      console.warn('Failed to fetch priorities, falling back to equal weights');
      weightedPool = [...data.subjectIds];
    }

    // Shuffle the pool to ensure distribution
    for (let i = weightedPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [weightedPool[i], weightedPool[j]] = [weightedPool[j], weightedPool[i]];
    }

    if (weightedPool.length === 0) weightedPool = [...data.subjectIds];

    let poolIndex = 0;

    // Distribute sessions dynamically based on weighted pool
    for (let day = 0; day < data.durationDays; day++) {
      const dayOfWeek = day % 7;
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
      const isLastDay = day === data.durationDays - 1;

      for (let session = 0; session < sessionsPerDay; session++) {
        const isLastSessionOfWeekend = isWeekend && session === sessionsPerDay - 1;
        const isMockTestBlock = isLastDay && session === sessionsPerDay - 1;
        const isRevisionBlock = isWeekend && !isMockTestBlock;

        let currentSessionLen = sessionLen;
        
        // Mock Tests take 3 hours, Revisions take 2 hours
        if (isMockTestBlock) {
          currentSessionLen = 3;
        } else if (isRevisionBlock) {
          currentSessionLen = Math.max(sessionLen, 2);
        }
        
        const subjectId = weightedPool[poolIndex % weightedPool.length];
        poolIndex++;

        // Increase session length slightly if it's a weak subject and we have time
        const startH = baseHour + session * (sessionLen + 0.5); // Still spacing by original session length logic so start times don't overlap too weirdly
        const endH = startH + currentSessionLen;

        if (endH > 23) break; // Allow Mock tests to go until 11 PM

        const pad = (n: number) => String(Math.floor(n)).padStart(2, '0');
        const startMins = Math.round((startH % 1) * 60);
        const endMins = Math.round((endH % 1) * 60);

        slots.push({
          subjectId,
          dayOfWeek,
          startTime: `${pad(startH)}:${pad(startMins)}:00`,
          endTime: `${pad(endH)}:${pad(endMins)}:00`,
        });
      }
    }

    const response = await apiClient.post<any>('/api/timetable/generate', {
      weekStartDate: data.startDate || new Date().toISOString().split('T')[0],
      title: `AI Smart ${data.style.charAt(0).toUpperCase() + data.style.slice(1)} Plan`,
      slots,
    });

    const timetableData = response.data.data;
    return mapBackendSlots(timetableData.slots || []);
  },


  getActiveTimetable: async (): Promise<TimetableSlot[]> => {
    try {
      const response = await apiClient.get<any>('/api/timetable/active');
      const timetableData = response.data.data;
      return mapBackendSlots(timetableData.slots || []);
    } catch (error) {
      console.error("Failed to fetch active timetable from backend", error);
      return [];
    }
  },

  updateSlotStatus: async (slotId: string, status: 'completed' | 'skipped' | 'pending'): Promise<TimetableSlot> => {
    const response = await apiClient.patch<any>(`/api/timetable/slots/${slotId}/complete`);
    const updatedSlot = response.data.data;
    
    const startOfWeek = new Date();
    const currentDay = startOfWeek.getDay();
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    startOfWeek.setDate(startOfWeek.getDate() + distanceToMonday);

    const slotDate = new Date(startOfWeek);
    slotDate.setDate(startOfWeek.getDate() + (updatedSlot.dayOfWeek ?? 0));
    const dateStr = slotDate.toISOString().split('T')[0];

    return {
      id: updatedSlot.id,
      subjectId: updatedSlot.subject?.id || '',
      subject: updatedSlot.subject ? {
        id: updatedSlot.subject.id,
        name: updatedSlot.subject.subjectName,
        color: updatedSlot.subject.color || '#2196F3',
        icon: updatedSlot.subject.icon || 'book',
        studentId: ''
      } : undefined,
      startTime: updatedSlot.startTime ? updatedSlot.startTime.substring(0, 5) : '09:00',
      endTime: updatedSlot.endTime ? updatedSlot.endTime.substring(0, 5) : '10:00',
      date: dateStr,
      status: updatedSlot.isCompleted ? 'completed' : 'pending',
      timetableId: 'active-timetable'
    };
  }
};
