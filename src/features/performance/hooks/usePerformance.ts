import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { performanceApi, AddMarkDTO } from '../../../api/performance.api';

export const PERFORMANCE_REPORT_KEY = ['performance', 'report'];
export const PERFORMANCE_PRIORITY_KEY = ['performance', 'priority'];

export const usePerformanceReport = () => {
  return useQuery({
    queryKey: PERFORMANCE_REPORT_KEY,
    queryFn: performanceApi.getReport,
  });
};

export const useStudyPriorities = () => {
  return useQuery({
    queryKey: PERFORMANCE_PRIORITY_KEY,
    queryFn: performanceApi.getPriorities,
  });
};

export const useAddMark = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AddMarkDTO) => performanceApi.addMark(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PERFORMANCE_REPORT_KEY });
      qc.invalidateQueries({ queryKey: PERFORMANCE_PRIORITY_KEY });
    },
  });
};
