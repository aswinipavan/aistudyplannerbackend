import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { ProgressCircle } from 'react-native-svg-charts';
import { usePerformanceReport } from './hooks/usePerformance';
import { Theme } from '../../theme';
import { SubjectPerformance } from '../../types/api.types';

export const PerformanceScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList, 'Performance'>>();
  const { data: report, isLoading: reportLoading } = usePerformanceReport();

  if (reportLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.light.colors.primary} />
      </View>
    );
  }

  if (!report) return null;

  const strongSubjects = report.subjectBreakdown.filter(s => s.status === 'Strong');
  const averageSubjects = report.subjectBreakdown.filter(s => s.status === 'Average');
  const weakSubjects = report.subjectBreakdown.filter(s => s.status === 'Weak');

  const renderSubjectCard = (subject: SubjectPerformance) => {
    let statusColor = Theme.light.colors.primary;
    if (subject.status === 'Weak') statusColor = Theme.light.colors.error;
    if (subject.status === 'Average') statusColor = '#FF9800';

    return (
      <View key={subject.subjectId} style={styles.subjectCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.subjectName}>{subject.subjectName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{subject.status}</Text>
          </View>
        </View>
        
        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Priority Score</Text>
            <Text style={[styles.metricValue, { color: statusColor }]}>{subject.priorityScore}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Avg Score</Text>
            <Text style={styles.metricValue}>{subject.averageScore}%</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Study Target</Text>
            <Text style={styles.metricValue}>{subject.suggestedStudyHours}h/day</Text>
          </View>
        </View>

        <View style={styles.recommendationBox}>
          <Text style={styles.recommendationText}>🤖 {subject.aiRecommendation}</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>AI Subject Analysis</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('AddMark')} 
          style={styles.addScoreButton}
        >
          <Text style={styles.addScoreText}>+ Add Score</Text>
        </TouchableOpacity>
      </View>
      
      {/* AI Readiness Score Hero */}
      <View style={styles.heroWidget}>
        <Text style={styles.widgetTitle}>AI Readiness Score</Text>
        <View style={styles.progressContainer}>
          <ProgressCircle
            style={{ height: 150 }}
            progress={(report.aiReadinessScore || 0) / 100}
            progressColor={Theme.light.colors.primary}
            backgroundColor={Theme.light.colors.background}
            strokeWidth={15}
          />
          <View style={styles.centerTextContainer}>
            <Text style={styles.centerText}>{report.aiReadinessScore || 0}%</Text>
            <Text style={styles.centerLabel}>Ready</Text>
          </View>
        </View>
      </View>

      {/* Weak Subjects Section */}
      {weakSubjects.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Theme.light.colors.error }]}>Critical Focus (Weak)</Text>
          {weakSubjects.map(renderSubjectCard)}
        </View>
      )}

      {/* Average Subjects Section */}
      {averageSubjects.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#FF9800' }]}>Steady Progress (Average)</Text>
          {averageSubjects.map(renderSubjectCard)}
        </View>
      )}

      {/* Strong Subjects Section */}
      {strongSubjects.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Theme.light.colors.primary }]}>Mastered (Strong)</Text>
          {strongSubjects.map(renderSubjectCard)}
        </View>
      )}

      {/* Overall AI Improvement Suggestions */}
      <View style={styles.widget}>
        <Text style={styles.widgetTitle}>Overall AI Suggestions</Text>
        {report.recommendations.length > 0 ? (
          report.recommendations.map((rec, index) => (
            <View key={index} style={styles.recCard}>
              <Text style={styles.recText}>✨ {rec}</Text>
            </View>
          ))
        ) : (
          <View style={styles.recCard}>
            <Text style={styles.recText}>✨ Keep maintaining your current study streak. Your profile is balanced.</Text>
          </View>
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.light.colors.background,
    padding: Theme.light.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: Theme.light.spacing.xl 
  },
  header: {
    ...Theme.light.typography.h1,
    color: Theme.light.colors.text,
  },
  addScoreButton: {
    backgroundColor: Theme.light.colors.primary + '20', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 16
  },
  addScoreText: {
    color: Theme.light.colors.primary, 
    fontWeight: 'bold'
  },
  heroWidget: {
    backgroundColor: Theme.light.colors.surface,
    padding: Theme.light.spacing.xl,
    borderRadius: 16,
    marginBottom: Theme.light.spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  widgetTitle: {
    ...Theme.light.typography.h3,
    color: Theme.light.colors.text,
    marginBottom: Theme.light.spacing.lg,
    alignSelf: 'flex-start',
  },
  progressContainer: {
    width: 150,
    height: 150,
    position: 'relative',
  },
  centerTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Theme.light.colors.primary,
  },
  centerLabel: {
    fontSize: 12,
    color: Theme.light.colors.textSecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: Theme.light.spacing.xl,
  },
  sectionTitle: {
    ...Theme.light.typography.h3,
    marginBottom: Theme.light.spacing.md,
  },
  subjectCard: {
    backgroundColor: Theme.light.colors.surface,
    borderRadius: 12,
    padding: Theme.light.spacing.md,
    marginBottom: Theme.light.spacing.md,
    borderWidth: 1,
    borderColor: Theme.light.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.light.spacing.md,
  },
  subjectName: {
    ...Theme.light.typography.h3,
    color: Theme.light.colors.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.light.spacing.md,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 10,
    color: Theme.light.colors.textSecondary,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.light.colors.text,
  },
  recommendationBox: {
    backgroundColor: '#F8F9FA',
    padding: Theme.light.spacing.sm,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: Theme.light.colors.primary,
  },
  recommendationText: {
    fontSize: 13,
    color: Theme.light.colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  widget: {
    backgroundColor: Theme.light.colors.surface,
    padding: Theme.light.spacing.md,
    borderRadius: 16,
    marginBottom: Theme.light.spacing.lg,
    borderWidth: 1,
    borderColor: Theme.light.colors.border,
  },
  recCard: {
    backgroundColor: '#F5F5FF',
    padding: Theme.light.spacing.md,
    borderRadius: 8,
    marginBottom: Theme.light.spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: Theme.light.colors.primary,
  },
  recText: {
    ...Theme.light.typography.body,
    color: Theme.light.colors.text,
    fontStyle: 'italic',
  }
});
