import { PerformanceReport, SubjectPerformance } from '../types/api.types';

export const performanceApi = {
  getReport: async (): Promise<PerformanceReport> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          overallAverage: 82.5,
          trend: 'improving',
          recommendations: [
            "Focus more on Physics; your average has dropped by 5% recently.",
            "Great job in Mathematics! You're consistently scoring above 90%.",
            "Try adding 15 more minutes to your daily Chemistry study sessions."
          ],
          subjectBreakdown: [
            {
              subjectId: 'sub-1',
              subjectName: 'Mathematics',
              averageScore: 92,
              priority: 1,
              marksHistory: [
                { id: 'm1', subjectId: 'sub-1', score: 85, maxScore: 100, testName: 'Test 1', date: '2023-09-01' },
                { id: 'm2', subjectId: 'sub-1', score: 92, maxScore: 100, testName: 'Test 2', date: '2023-10-01' },
                { id: 'm3', subjectId: 'sub-1', score: 99, maxScore: 100, testName: 'Test 3', date: '2023-11-01' }
              ]
            },
            {
              subjectId: 'sub-2',
              subjectName: 'Physics',
              averageScore: 73,
              priority: 5,
              marksHistory: [
                { id: 'm4', subjectId: 'sub-2', score: 80, maxScore: 100, testName: 'Test 1', date: '2023-09-01' },
                { id: 'm5', subjectId: 'sub-2', score: 75, maxScore: 100, testName: 'Test 2', date: '2023-10-01' },
                { id: 'm6', subjectId: 'sub-2', score: 64, maxScore: 100, testName: 'Test 3', date: '2023-11-01' }
              ]
            }
          ]
        });
      }, 800);
    });
  },

  getPriorities: async (): Promise<SubjectPerformance[]> => {
    const report = await performanceApi.getReport();
    return report.subjectBreakdown.sort((a, b) => b.priority - a.priority);
  }
};
