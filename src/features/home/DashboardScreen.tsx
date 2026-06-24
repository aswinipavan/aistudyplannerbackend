import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardApi } from '../../api/dashboard.api';
import { performanceApi } from '../../api/performance.api';
import { Theme } from '../../theme';
import { useAuthStore } from '../../store/authStore';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

export const DashboardScreen = () => {
  const { user } = useAuthStore();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList, 'Dashboard'>>();
  const qc = useQueryClient();

  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardOverview'],
    queryFn: dashboardApi.getOverview,
  });

  const { data: report } = useQuery({
    queryKey: ['performanceReport'],
    queryFn: performanceApi.getReport,
  });

  const completeTaskMutation = useMutation({
    mutationFn: (taskId: string) => dashboardApi.completeTask(taskId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dashboardOverview'] });
    },
  });

  const handleToggleTask = (taskId: string, alreadyCompleted: boolean) => {
    if (alreadyCompleted) return;
    setCompletedIds(prev => new Set([...prev, taskId]));
    completeTaskMutation.mutate(taskId);
  };

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: '#0B0F19' }]}>
        <ActivityIndicator size="large" color="#00F0FF" />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: '#0B0F19' }]}>
        <Text style={styles.errorText}>Failed to load dashboard.</Text>
      </View>
    );
  }

  const streak = data.activeTasks.filter(t => t.isCompleted).length > 0 ? 3 : 2; // Derived Mock for streak
  const xp = data.activeTasks.filter(t => t.isCompleted).length * 50 + 1200; // Derived mock for XP

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <LinearGradient
        colors={['#0B0F19', '#1A1025']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back,</Text>
        <Text style={styles.name}>{user?.name || 'Student'} ✨</Text>
      </View>

      {/* Hero Section */}
      <LinearGradient
        colors={['rgba(138, 43, 226, 0.15)', 'rgba(0, 240, 255, 0.05)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <View style={styles.heroRow}>
          <View style={styles.heroItem}>
            <Text style={styles.heroValue}>{report?.academicScore || 0}</Text>
            <Text style={styles.heroLabel}>Academic Score</Text>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroItem}>
            <Text style={styles.heroValue}>{report?.aiReadinessScore || 0}%</Text>
            <Text style={styles.heroLabel}>AI Readiness</Text>
          </View>
        </View>
        <View style={[styles.heroRow, { marginTop: 16 }]}>
          <View style={styles.heroItem}>
            <Text style={styles.heroValue}>{streak} 🔥</Text>
            <Text style={styles.heroLabel}>Day Streak</Text>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroItem}>
            <Text style={styles.heroValue}>{xp} XP</Text>
            <Text style={styles.heroLabel}>Total XP</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('AddExam')}>
          <LinearGradient colors={['#8A2BE2', '#4A00E0']} style={styles.actionGradient}>
            <Text style={styles.actionIcon}>📝</Text>
          </LinearGradient>
          <Text style={styles.actionText}>Add Mark</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => (navigation.getParent() as any)?.navigate('SubjectsStack')}>
          <LinearGradient colors={['#00F0FF', '#0080FF']} style={styles.actionGradient}>
            <Text style={styles.actionIcon}>📚</Text>
          </LinearGradient>
          <Text style={styles.actionText}>Subjects</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => (navigation.getParent() as any)?.navigate('TimetableStack')}>
          <LinearGradient colors={['#FF007F', '#FF4E00']} style={styles.actionGradient}>
            <Text style={styles.actionIcon}>⏱️</Text>
          </LinearGradient>
          <Text style={styles.actionText}>Timer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => (navigation.getParent() as any)?.navigate('AITutorStack')}>
          <LinearGradient colors={['#00FF87', '#60EFFF']} style={styles.actionGradient}>
            <Text style={styles.actionIcon}>🤖</Text>
          </LinearGradient>
          <Text style={styles.actionText}>AI Chat</Text>
        </TouchableOpacity>
      </View>

      {/* Active Tasks Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Plan</Text>
        {data.activeTasks.map((task) => {
          const isCompleted = completedIds.has(task.id) || task.isCompleted;
          return (
            <View key={task.id} style={styles.glassCard}>
              <View style={[styles.taskColorIndicator, { backgroundColor: task.subjectColor }]} />
              <View style={styles.taskInfo}>
                <Text style={[styles.taskTitle, isCompleted && { textDecorationLine: 'line-through', opacity: 0.5 }]}>
                  {task.title}
                </Text>
                <Text style={styles.taskTime}>{task.time} • {task.subjectName}</Text>
              </View>
              <TouchableOpacity
                style={[styles.checkbox, isCompleted && styles.checkboxDone]}
                onPress={() => handleToggleTask(task.id, isCompleted)}
              >
                {isCompleted && <View style={styles.checkboxTick} />}
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* Priority Subjects Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Priority Focus</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {data.prioritySubjects.map((subject) => (
            <View key={subject.id} style={styles.glassSubjectCard}>
              <View style={[styles.subjectIcon, { backgroundColor: subject.color + '40' }]}>
                <View style={[styles.subjectDot, { backgroundColor: subject.color }]} />
              </View>
              <Text style={styles.subjectName}>{subject.name}</Text>
              <Text style={styles.subjectScore}>Priority: {subject.priorityScore}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Upcoming Exams Section */}
      <View style={styles.section}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Theme.light.spacing.md }}>
          <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Upcoming Exams</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Exams')}>
            <Text style={{ color: '#00F0FF', fontSize: 14, fontWeight: '600' }}>View All</Text>
          </TouchableOpacity>
        </View>
        {data.upcomingExams.map((exam) => (
          <View key={exam.id} style={styles.glassCard}>
            <View style={styles.examInfo}>
              <Text style={styles.examTitle}>{exam.title}</Text>
              <Text style={styles.examDate}>{new Date(exam.date).toDateString()}</Text>
            </View>
            <View style={styles.daysRemainingContainer}>
              <Text style={styles.daysRemainingText}>{exam.daysRemaining} days</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19' },
  content: { padding: Theme.light.spacing.lg, paddingBottom: Theme.light.spacing.xxl },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: Theme.light.colors.error, fontSize: 16 },
  
  header: { marginBottom: Theme.light.spacing.xl, marginTop: 40 },
  greeting: { fontSize: 16, color: '#A0AEC0' },
  name: { fontSize: 32, fontWeight: '800', color: '#FFFFFF', marginTop: 4 },

  heroCard: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 32,
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroItem: {
    flex: 1,
    alignItems: 'center',
  },
  heroValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroLabel: {
    fontSize: 12,
    color: '#A0AEC0',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  heroDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },

  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  actionBtn: {
    alignItems: 'center',
  },
  actionGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionText: {
    color: '#A0AEC0',
    fontSize: 12,
    fontWeight: '600',
  },

  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginBottom: 16 },

  glassCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  taskColorIndicator: { width: 4, height: '100%', borderRadius: 2, marginRight: 16 },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  taskTime: { fontSize: 12, color: '#A0AEC0', marginTop: 4 },
  
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center' },
  checkboxDone: { backgroundColor: '#00F0FF', borderColor: '#00F0FF' },
  checkboxTick: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#0B0F19' },

  glassSubjectCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 20,
    marginRight: 16,
    width: 140,
    alignItems: 'center',
  },
  subjectIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  subjectDot: { width: 16, height: 16, borderRadius: 8 },
  subjectName: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },
  subjectScore: { fontSize: 12, color: '#FF007F', marginTop: 4, fontWeight: '600' },

  examInfo: { flex: 1 },
  examTitle: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  examDate: { fontSize: 12, color: '#A0AEC0', marginTop: 4 },
  daysRemainingContainer: { backgroundColor: 'rgba(0, 240, 255, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  daysRemainingText: { color: '#00F0FF', fontSize: 12, fontWeight: '700' },
});
