import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { examsApi } from '../../../api/exams.api';
import { Exam } from '../../../types/api.types';

export const EXAMS_KEY = ['exams'];

export const useExams = () => {
  return useQuery({
    queryKey: EXAMS_KEY,
    queryFn: () => examsApi.getAll(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateExam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Exam, 'id'>) => examsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: EXAMS_KEY }),
  });
};

export const useDeleteExam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => examsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: EXAMS_KEY }),
  });
};
