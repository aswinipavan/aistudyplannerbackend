import { useQuery } from '@tanstack/react-query';
import { performanceApi } from '../../../api/performance.api';

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
