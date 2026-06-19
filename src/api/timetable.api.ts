import { TimetableSlot } from '../types/api.types';

export interface GenerateTimetableDTO {
  availableHours: number;
  style: 'intense' | 'balanced' | 'relaxed';
  subjectIds: string[];
  startDate: string;
  durationDays: number;
}

export const timetableApi = {
  generateTimetable: async (data: GenerateTimetableDTO): Promise<TimetableSlot[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const slots: TimetableSlot[] = [];
        const baseDate = new Date(data.startDate);
        let idCounter = 1;
        
        for (let i = 0; i < data.durationDays; i++) {
          const currentDate = new Date(baseDate);
          currentDate.setDate(currentDate.getDate() + i);
          
          data.subjectIds.forEach((subjectId, index) => {
            slots.push({
              id: `slot-${idCounter++}`,
              subjectId,
              startTime: `${9 + index}:00`,
              endTime: `${10 + index}:00`,
              date: currentDate.toISOString().split('T')[0],
              status: 'pending',
              timetableId: `tt-${Date.now()}`
            });
          });
        }
        resolve(slots);
      }, 1500);
    });
  },

  getActiveTimetable: async (): Promise<TimetableSlot[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'slot-1',
            subjectId: 'sub-1', // Mock
            startTime: '09:00',
            endTime: '11:00',
            date: new Date().toISOString().split('T')[0],
            status: 'pending',
            timetableId: 'tt-active'
          },
          {
            id: 'slot-2',
            subjectId: 'sub-2', // Mock
            startTime: '13:00',
            endTime: '15:00',
            date: new Date().toISOString().split('T')[0],
            status: 'pending',
            timetableId: 'tt-active'
          }
        ]);
      }, 500);
    });
  },

  updateSlotStatus: async (slotId: string, status: 'completed' | 'skipped' | 'pending'): Promise<TimetableSlot> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: slotId,
          subjectId: 'sub-1', 
          startTime: '09:00',
          endTime: '11:00',
          date: new Date().toISOString().split('T')[0],
          status,
          timetableId: 'tt-active'
        });
      }, 500);
    });
  }
};
