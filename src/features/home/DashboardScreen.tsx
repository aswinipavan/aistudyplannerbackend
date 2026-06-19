import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../../api/dashboard.api';
import { Theme } from '../../theme';
import { useAuthStore } from '../../store/authStore';

export const DashboardScreen = () => {
  const { user } = useAuthStore();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList, 'Dashboard'>>();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardOverview'],
    queryFn: dashboardApi.getOverview,
  });

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Theme.light.colors.primary} />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load dashboard.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name || 'Student'} 👋</Text>
        <Text style={styles.subtitle}>Here is your study overview for today.</Text>
      </View>

      {/* Active Tasks Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Plan</Text>
        {data.activeTasks.map((task) => (
          <View key={task.id} style={styles.taskCard}>
            <View style={[styles.taskColorIndicator, { backgroundColor: task.subjectColor }]} />
            <View style={styles.taskInfo}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskTime}>{task.time} • {task.subjectName}</Text>
            </View>
            <TouchableOpacity style={styles.checkbox} />
          </View>
        ))}
      </View>

      {/* Priority Subjects Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Priority Subjects</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {data.prioritySubjects.map((subject) => (
            <View key={subject.id} style={styles.subjectCard}>
              <View style={[styles.subjectIcon, { backgroundColor: subject.color + '20' }]}>
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
            <Text style={{ color: Theme.light.colors.primary, ...Theme.light.typography.body }}>View All</Text>
          </TouchableOpacity>
        </View>
        {data.upcomingExams.map((exam) => (
          <View key={exam.id} style={styles.examCard}>
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
  container: { flex: 1, backgroundColor: Theme.light.colors.background },
  content: { padding: Theme.light.spacing.lg, paddingBottom: Theme.light.spacing.xxl },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Theme.light.colors.background },
  errorText: { color: Theme.light.colors.error, ...Theme.light.typography.body },
  
  header: { marginBottom: Theme.light.spacing.xl },
  greeting: { ...Theme.light.typography.h1, color: Theme.light.colors.text },
  subtitle: { ...Theme.light.typography.body, color: Theme.light.colors.textSecondary, marginTop: Theme.light.spacing.xs },

  section: { marginBottom: Theme.light.spacing.xl },
  sectionTitle: { ...Theme.light.typography.h2, color: Theme.light.colors.text, marginBottom: Theme.light.spacing.md },

  taskCard: {
    flexDirection: 'row',
    backgroundColor: Theme.light.colors.surface,
    padding: Theme.light.spacing.md,
    borderRadius: 12,
    marginBottom: Theme.light.spacing.sm,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  taskColorIndicator: { width: 4, height: '100%', borderRadius: 2, marginRight: Theme.light.spacing.md },
  taskInfo: { flex: 1 },
  taskTitle: { ...Theme.light.typography.h3, color: Theme.light.colors.text },
  taskTime: { ...Theme.light.typography.caption, color: Theme.light.colors.textSecondary, marginTop: 4 },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: Theme.light.colors.border },

  subjectCard: {
    backgroundColor: Theme.light.colors.surface,
    padding: Theme.light.spacing.md,
    borderRadius: 16,
    marginRight: Theme.light.spacing.md,
    width: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  subjectIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: Theme.light.spacing.sm },
  subjectDot: { width: 12, height: 12, borderRadius: 6 },
  subjectName: { ...Theme.light.typography.h3, color: Theme.light.colors.text },
  subjectScore: { ...Theme.light.typography.caption, color: Theme.light.colors.error, marginTop: 4 },

  examCard: {
    flexDirection: 'row',
    backgroundColor: Theme.light.colors.surface,
    padding: Theme.light.spacing.md,
    borderRadius: 12,
    marginBottom: Theme.light.spacing.sm,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  examInfo: { flex: 1 },
  examTitle: { ...Theme.light.typography.h3, color: Theme.light.colors.text },
  examDate: { ...Theme.light.typography.caption, color: Theme.light.colors.textSecondary, marginTop: 4 },
  daysRemainingContainer: { backgroundColor: Theme.light.colors.primary + '20', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  daysRemainingText: { color: Theme.light.colors.primary, ...Theme.light.typography.small, fontWeight: '600' },
});
