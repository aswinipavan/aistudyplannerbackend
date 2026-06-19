import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { timetableApi, GenerateTimetableDTO } from '../../../api/timetable.api';
import { TimetableSlot } from '../../../types/api.types';

export const TIMETABLE_ACTIVE_KEY = ['timetable', 'active'];

export const useActiveTimetable = () => {
  return useQuery({
    queryKey: TIMETABLE_ACTIVE_KEY,
    queryFn: timetableApi.getActiveTimetable,
  });
};

export const useGenerateTimetable = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: GenerateTimetableDTO) => timetableApi.generateTimetable(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TIMETABLE_ACTIVE_KEY });
    }
  });
};

export const useUpdateSlotStatus = () => {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: ({ slotId, status }: { slotId: string, status: 'completed' | 'skipped' | 'pending' }) => 
      timetableApi.updateSlotStatus(slotId, status),
    onMutate: async ({ slotId, status }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await qc.cancelQueries({ queryKey: TIMETABLE_ACTIVE_KEY });

      // Snapshot the previous value
      const previousTimetable = qc.getQueryData<TimetableSlot[]>(TIMETABLE_ACTIVE_KEY);

      // Optimistically update to the new value
      if (previousTimetable) {
        qc.setQueryData<TimetableSlot[]>(TIMETABLE_ACTIVE_KEY, old => 
          old?.map(slot => slot.id === slotId ? { ...slot, status } : slot)
        );
      }

      // Return a context object with the snapshotted value
      return { previousTimetable };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTimetable) {
        qc.setQueryData(TIMETABLE_ACTIVE_KEY, context.previousTimetable);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure data is in sync
      qc.invalidateQueries({ queryKey: TIMETABLE_ACTIVE_KEY });
    },
  });
};
