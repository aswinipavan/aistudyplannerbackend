import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { LineChart, BarChart, ProgressChart } from 'react-native-chart-kit';
import { usePerformanceReport } from './hooks/usePerformance';
import { Theme } from '../../theme';

const screenWidth = Dimensions.get('window').width;

export const AnalyticsScreen = () => {
  const { data: report, isLoading } = usePerformanceReport();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.light.colors.primary} />
      </View>
    );
  }

  if (!report) return null;

  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: Theme.light.colors.surface,
    backgroundGradientTo: Theme.light.colors.surface,
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
  };

  // 1. Radar Chart Data (Mapped to ProgressChart since react-native-chart-kit doesn't have a native Radar Chart)
  const progressData = {
    labels: ["Attendance", "Marks", "Study Time", "Target"],
    data: [
      (report.attendancePercentage || 0) / 100,
      report.overallAverage / 100,
      (report.studyEfficiencyScore || 0) / 100,
      0.9 // Target is 90%
    ]
  };

  // 2. Subject Comparison Chart Data
  const subjectComparisonData = {
    labels: report.subjectBreakdown.map(s => s.subjectName.substring(0, 3)),
    datasets: [{ data: report.subjectBreakdown.map(s => s.averageScore) }]
  };

  // 3. Marks Trend (Line Chart)
  const marksTrendData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{ data: [65, 68, 74, 72, report.overallAverage, report.overallAverage + 2] }]
  };

  // 4. Attendance Trend (Line Chart)
  const attendanceTrendData = {
    labels: ["W1", "W2", "W3", "W4"],
    datasets: [{
      data: [80, 85, report.attendancePercentage, report.attendancePercentage + 2],
      color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`
    }]
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Advanced Analytics</Text>

      {/* KPI Cards */}
      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiValue}>{report.academicScore}</Text>
          <Text style={styles.kpiLabel}>Academic Score</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiValue}>{report.studyEfficiencyScore}%</Text>
          <Text style={styles.kpiLabel}>Study Efficiency</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiValue}>{report.aiReadinessScore}%</Text>
          <Text style={styles.kpiLabel}>AI Readiness</Text>
        </View>
      </View>

      {/* Radar Chart Substitute (Progress Rings) */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Performance Metrics Comparison</Text>
        <ProgressChart
          data={progressData}
          width={screenWidth - Theme.light.spacing.lg * 2 - Theme.light.spacing.md * 2}
          height={220}
          strokeWidth={16}
          radius={32}
          chartConfig={chartConfig}
          hideLegend={false}
        />
      </View>

      {/* Subject Comparison Chart */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Subject Comparison</Text>
        <BarChart
          data={subjectComparisonData}
          width={screenWidth - Theme.light.spacing.lg * 2 - Theme.light.spacing.md * 2}
          height={220}
          yAxisLabel=""
          yAxisSuffix="%"
          chartConfig={chartConfig}
          verticalLabelRotation={0}
        />
      </View>

      {/* Marks Trend Chart */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Marks Trend (Monthly)</Text>
        <LineChart
          data={marksTrendData}
          width={screenWidth - Theme.light.spacing.lg * 2 - Theme.light.spacing.md * 2}
          height={220}
          yAxisLabel=""
          yAxisSuffix="%"
          chartConfig={chartConfig}
          bezier
        />
      </View>

      {/* Attendance Trend Chart */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Attendance Trend (Weekly)</Text>
        <LineChart
          data={attendanceTrendData}
          width={screenWidth - Theme.light.spacing.lg * 2 - Theme.light.spacing.md * 2}
          height={220}
          yAxisLabel=""
          yAxisSuffix="%"
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
          }}
          bezier
        />
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.light.colors.background,
  },
  content: {
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
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.light.spacing.xl,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: Theme.light.colors.surface,
    padding: Theme.light.spacing.md,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.light.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.light.colors.primary,
    marginBottom: 4,
  },
  kpiLabel: {
    fontSize: 10,
    color: Theme.light.colors.textSecondary,
    textAlign: 'center',
  },
  chartCard: {
    backgroundColor: Theme.light.colors.surface,
    padding: Theme.light.spacing.md,
    borderRadius: 16,
    marginBottom: Theme.light.spacing.lg,
    borderWidth: 1,
    borderColor: Theme.light.colors.border,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    ...Theme.light.typography.h3,
    color: Theme.light.colors.text,
    marginBottom: Theme.light.spacing.md,
    alignSelf: 'flex-start',
  }
});
