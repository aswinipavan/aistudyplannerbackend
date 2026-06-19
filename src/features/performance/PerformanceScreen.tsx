import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { ProgressCircle, BarChart, LineChart, Grid } from 'react-native-svg-charts';
import { usePerformanceReport, useStudyPriorities } from './hooks/usePerformance';
import { Theme } from '../../theme';

export const PerformanceScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList, 'Performance'>>();
  const { data: report, isLoading: reportLoading } = usePerformanceReport();
  const { data: priorities, isLoading: prioritiesLoading } = useStudyPriorities();

  if (reportLoading || prioritiesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.light.colors.primary} />
      </View>
    );
  }

  if (!report) return null;

  // Data for charts
  const barData = report.subjectBreakdown.map(s => ({
    value: s.averageScore,
    svg: { fill: Theme.light.colors.primary },
    key: s.subjectId,
    label: s.subjectName
  }));

  // Mock trend data
  const lineData = [50, 60, 55, 70, 75, 82, 85];

  return (
    <ScrollView style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Theme.light.spacing.xl }}>
        <Text style={[styles.header, { marginBottom: 0 }]}>Performance Dashboard</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddMark')} style={{ backgroundColor: Theme.light.colors.primary + '20', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 }}>
          <Text style={{ color: Theme.light.colors.primary, fontWeight: 'bold' }}>+ Add Score</Text>
        </TouchableOpacity>
      </View>
      
      {/* 1. Overall average score: Circular progress ring */}
      <View style={styles.widget}>
        <Text style={styles.widgetTitle}>Overall Average</Text>
        <ProgressCircle
          style={{ height: 150 }}
          progress={report.overallAverage / 100}
          progressColor={Theme.light.colors.primary}
          backgroundColor={Theme.light.colors.background}
          strokeWidth={15}
        />
        <View style={styles.centerTextContainer}>
          <Text style={styles.centerText}>{report.overallAverage}%</Text>
        </View>
      </View>

      {/* 2. Subject scores comparison: Horizontal bar chart */}
      <View style={styles.widget}>
        <Text style={styles.widgetTitle}>Subject Comparison</Text>
        <View style={{ height: 200, flexDirection: 'row' }}>
          <View style={{ flex: 1, justifyContent: 'space-around', paddingVertical: 10 }}>
            {barData.map((d, index) => (
              <Text key={index} style={{ fontSize: 10, color: Theme.light.colors.text }}>{d.label}</Text>
            ))}
          </View>
          <BarChart
            style={{ flex: 3 }}
            data={barData}
            horizontal={true}
            yAccessor={({ item }: { item: any }) => item.value}
            svg={{ fill: Theme.light.colors.primary }}
            contentInset={{ top: 10, bottom: 10 }}
            spacingInner={0.2}
            gridMin={0}
            gridMax={100}
          >
            <Grid direction={Grid.Direction.VERTICAL} />
          </BarChart>
        </View>
      </View>

      {/* 3. Score trend over time: Line chart */}
      <View style={styles.widget}>
        <Text style={styles.widgetTitle}>Score Trend</Text>
        <LineChart
          style={{ height: 150 }}
          data={lineData}
          svg={{ stroke: Theme.light.colors.primary, strokeWidth: 3 }}
          contentInset={{ top: 20, bottom: 20 }}
        >
          <Grid />
        </LineChart>
      </View>

      {/* 4. Study priority ranking: Ranked card list */}
      <View style={styles.widget}>
        <Text style={styles.widgetTitle}>Priority Rankings</Text>
        {priorities?.map((p, index) => (
          <View key={p.subjectId} style={styles.priorityCard}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>#{index + 1}</Text>
            </View>
            <Text style={styles.priorityName}>{p.subjectName}</Text>
            <Text style={styles.priorityScore}>Avg: {p.averageScore}%</Text>
          </View>
        ))}
      </View>

      {/* 5. AI recommendations: Styled text cards */}
      <View style={styles.widget}>
        <Text style={styles.widgetTitle}>AI Recommendations</Text>
        {report.recommendations.map((rec, index) => (
          <View key={index} style={styles.recCard}>
            <Text style={styles.recText}>✨ {rec}</Text>
          </View>
        ))}
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
  header: {
    ...Theme.light.typography.h1,
    color: Theme.light.colors.text,
    marginBottom: Theme.light.spacing.xl,
  },
  widget: {
    backgroundColor: Theme.light.colors.surface,
    padding: Theme.light.spacing.md,
    borderRadius: 16,
    marginBottom: Theme.light.spacing.lg,
    borderWidth: 1,
    borderColor: Theme.light.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  widgetTitle: {
    ...Theme.light.typography.h3,
    color: Theme.light.colors.text,
    marginBottom: Theme.light.spacing.md,
  },
  centerTextContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.light.colors.primary,
  },
  priorityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.light.spacing.md,
    backgroundColor: Theme.light.colors.background,
    borderRadius: 8,
    marginBottom: Theme.light.spacing.sm,
  },
  rankBadge: {
    backgroundColor: Theme.light.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: Theme.light.spacing.md,
  },
  rankText: {
    color: Theme.light.colors.surface,
    fontWeight: 'bold',
    fontSize: 12,
  },
  priorityName: {
    flex: 1,
    ...Theme.light.typography.body,
    fontWeight: 'bold',
  },
  priorityScore: {
    ...Theme.light.typography.caption,
    color: Theme.light.colors.textSecondary,
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
