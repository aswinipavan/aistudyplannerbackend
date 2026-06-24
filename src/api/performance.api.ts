import { apiClient } from './client';
import { PerformanceReport, SubjectPerformance, Mark } from '../types/api.types';
import { timetableApi } from './timetable.api';

export interface AddMarkDTO {
  subjectId: string;
  testName: string;
  score: number;
  maxScore: number;
  date?: string; // ISO date string, defaults to today
}

export const performanceApi = {
  getReport: async (): Promise<PerformanceReport> => {
    const response = await apiClient.get<any>('/api/performance/report');
    const reportData = response.data.data;

    const strong = reportData.strongSubjects || [];
    const weak = reportData.weakSubjects || [];
    const subjectWise = reportData.subjectWiseMarks || {};
    const recommendations = reportData.recommendations || [];

    // Combine weak and strong subjects into a map for quick reference
    const subjectsMap = new Map<string, any>();
    strong.forEach((s: any) => subjectsMap.set(s.subjectName, s));
    weak.forEach((s: any) => subjectsMap.set(s.subjectName, s));

    // Retrieve all marks to associate historical scores with subjects
    let allMarks: any[] = [];
    try {
      const marksResponse = await apiClient.get<any>('/api/marks/');
      allMarks = marksResponse.data.data || [];
    } catch (e) {
      console.warn("Failed to fetch marks for history in report", e);
    }

    const subjectBreakdown: SubjectPerformance[] = Object.keys(subjectWise).map((subName) => {
      const subInfo = subjectsMap.get(subName);
      const subId = subInfo?.id || '';
      const averageScore = subjectWise[subName] || 0;
      
      const marksHistory: Mark[] = allMarks
        .filter((m: any) => m.subject?.id === subId || m.subject?.subjectName === subName)
        .map((m: any) => ({
          id: m.id,
          subjectId: subId,
          score: Number(m.marksObtained),
          maxScore: Number(m.totalMarks),
          testName: m.examType || 'Test',
          date: m.examDate || new Date().toISOString().split('T')[0]
        }));

      // Determine priority: 5 is highest concern/priority, 1 is lowest
      let priority = 3;
      let status: 'Strong' | 'Average' | 'Weak' = 'Average';
      
      if (averageScore >= 75) {
        status = 'Strong';
        priority = 1;
      } else if (averageScore >= 50) {
        status = 'Average';
        priority = 3;
      } else {
        status = 'Weak';
        priority = 5;
      }

      // Calculate Priority Score (0-100)
      // Base is inversely proportional to average score (lower score = higher priority)
      let priorityScore = 100 - averageScore;
      // Add weight if it's explicitly marked weak by backend
      if (weak.some((s: any) => s.subjectName === subName)) {
        priorityScore = Math.min(100, priorityScore + 15);
      }
      
      // Calculate Confidence Score
      const confidenceScore = Math.min(100, averageScore + (marksHistory.length * 2));

      // AI Recommendation
      let aiRecommendation = '';
      let suggestedStudyHours = 1;
      if (status === 'Weak') {
        aiRecommendation = `You are underperforming in ${subName}. Focus on core concepts for 2 hours daily. Complete 3 practice tests before the exam.`;
        suggestedStudyHours = 2;
      } else if (status === 'Average') {
        aiRecommendation = `Your performance in ${subName} is steady. Review recent mistakes and study for 1.5 hours daily to reach the next level.`;
        suggestedStudyHours = 1.5;
      } else {
        aiRecommendation = `Great job in ${subName}! Maintain your streak by revising for 1 hour daily and taking advanced mock tests.`;
        suggestedStudyHours = 1;
      }

      return {
        subjectId: subId,
        subjectName: subName,
        averageScore,
        marksHistory,
        priority,
        status,
        priorityScore: Math.round(priorityScore),
        aiRecommendation,
        suggestedStudyHours,
        confidenceScore: Math.round(confidenceScore)
      };
    });

    const aiReadinessScore = Math.round(
      subjectBreakdown.reduce((acc, curr) => acc + curr.confidenceScore, 0) / (subjectBreakdown.length || 1)
    );

    // Calculate Attendance and Study Efficiency from Timetable Slots
    let attendancePercentage = 85; // Default fallback
    let studyEfficiencyScore = 80; // Default fallback
    try {
      const timetableSlots = await timetableApi.getActiveTimetable();
      if (timetableSlots && timetableSlots.length > 0) {
        const completedSlots = timetableSlots.filter((s: any) => s.status === 'completed').length;
        const pendingSlots = timetableSlots.filter((s: any) => s.status === 'pending').length;
        const totalActionable = completedSlots + pendingSlots;
        
        if (totalActionable > 0) {
          studyEfficiencyScore = Math.round((completedSlots / totalActionable) * 100);
          attendancePercentage = Math.round(Math.min(100, studyEfficiencyScore + 10)); // proxy for attendance
        }
      }
    } catch (e) {
      console.warn("Failed to fetch timetable for efficiency calc", e);
    }

    const overallAverage = reportData.overallPercentage || 0;
    const academicScore = Math.round((overallAverage * 0.7) + (aiReadinessScore * 0.3));

    return {
      overallAverage,
      subjectBreakdown,
      trend: 'stable',
      recommendations,
      aiReadinessScore,
      academicScore,
      studyEfficiencyScore,
      attendancePercentage
    };
  },


  getPriorities: async (): Promise<SubjectPerformance[]> => {
    const report = await performanceApi.getReport();
    return report.subjectBreakdown.sort((a, b) => b.priority - a.priority);
  },

  addMark: async (data: AddMarkDTO): Promise<Mark> => {
    const response = await apiClient.post<any>('/api/marks/', {
      subjectId: data.subjectId,
      examType: data.testName,
      marksObtained: data.score,
      totalMarks: data.maxScore,
      examDate: data.date || new Date().toISOString().split('T')[0],
    });
    const mark = response.data.data;
    return {
      id: mark.id,
      subjectId: mark.subjectId || data.subjectId,
      score: Number(mark.marksObtained),
      maxScore: Number(mark.totalMarks),
      testName: mark.examType || data.testName,
      date: mark.examDate || data.date || new Date().toISOString().split('T')[0],
    };
  }
};

