import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectsApi } from '../../../api/subjects.api';
import { CreateSubjectDTO } from '../../../types/api.types';

export const SUBJECTS_KEY = ['subjects'];

export const useSubjects = () => {
  return useQuery({
    queryKey: SUBJECTS_KEY,
    queryFn: () => subjectsApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 min cache
  });
};

export const useDeleteSubject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subjectsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: SUBJECTS_KEY }),
  });
};

export const useAddSubject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSubjectDTO) => subjectsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: SUBJECTS_KEY }),
  });
};
