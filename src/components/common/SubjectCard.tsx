import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { Subject, SubjectPerformance } from '../../types/api.types';
import { AppButton } from './AppButton';
import { useToastStore } from '../../store/toastStore';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface SubjectCardProps {
  subject: Subject;
  performance?: SubjectPerformance;
  onPressDetail: () => void;
}

export const SubjectCard = ({ subject, performance, onPressDetail }: SubjectCardProps) => {
  const { theme, typography } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const { showToast } = useToastStore();

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const handleRevisionPlan = () => {
    showToast(`Generating AI Revision Plan for ${subject.name}...`, 'success');
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.text.primary }]}>
      <TouchableOpacity style={styles.cardHeader} onPress={toggleExpand}>
        <View style={[styles.colorStrip, { backgroundColor: subject.color }]} />
        <View style={styles.cardContent}>
          <View style={styles.titleRow}>
            <Text style={[typography.h2, { color: theme.text.primary }]}>{subject.name}</Text>
            <Text style={{ fontSize: 18, color: theme.text.secondary }}>{expanded ? '▲' : '▼'}</Text>
          </View>
          <Text style={[typography.body, { color: theme.text.secondary, marginTop: 4 }]}>
            {performance?.status || 'Active'} • {performance ? `${performance.averageScore}% Avg` : 'No Data'}
          </Text>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.expandedContent}>
          <View style={styles.divider} />
          
          <View style={styles.metricsRow}>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Attendance</Text>
              <Text style={[styles.metricValue, { color: theme.text.primary }]}>85%</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Target Hours</Text>
              <Text style={[styles.metricValue, { color: theme.text.primary }]}>{performance?.suggestedStudyHours || 1}h/day</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Priority</Text>
              <Text style={[styles.metricValue, { color: theme.primary }]}>{performance?.priorityScore || 50}</Text>
            </View>
          </View>

          {performance?.marksHistory && performance.marksHistory.length > 0 && (
            <View style={styles.historySection}>
              <Text style={styles.sectionTitle}>Recent Marks</Text>
              {performance.marksHistory.slice(0, 3).map((mark, idx) => (
                <View key={idx} style={styles.markRow}>
                  <Text style={styles.markTestName}>{mark.testName}</Text>
                  <Text style={styles.markScore}>{mark.score}/{mark.maxScore}</Text>
                </View>
              ))}
            </View>
          )}

          {performance?.aiRecommendation && (
            <View style={[styles.aiTipBox, { borderLeftColor: theme.primary }]}>
              <Text style={styles.aiTipText}>💡 {performance.aiRecommendation}</Text>
            </View>
          )}

          <View style={styles.actionsRow}>
            <AppButton 
              label="Full Details" 
              variant="outline"
              onPress={onPressDetail} 
              style={styles.actionBtn} 
            />
            <AppButton 
              label="✨ Revision Plan" 
              onPress={handleRevisionPlan} 
              style={styles.actionBtn} 
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16, marginBottom: 16, overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)'
  },
  cardHeader: { flexDirection: 'row' },
  colorStrip: { width: 6 },
  cardContent: { padding: 16, flex: 1 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  expandedContent: { padding: 16, paddingTop: 0 },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.05)', marginBottom: 16 },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  metric: { flex: 1, alignItems: 'center' },
  metricLabel: { fontSize: 11, color: '#888', marginBottom: 4, textTransform: 'uppercase' },
  metricValue: { fontSize: 18, fontWeight: 'bold' },
  historySection: { marginBottom: 16 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#666', marginBottom: 8, textTransform: 'uppercase' },
  markRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  markTestName: { fontSize: 14, color: '#444' },
  markScore: { fontSize: 14, fontWeight: '600', color: '#222' },
  aiTipBox: { backgroundColor: '#F0F8FF', padding: 12, borderRadius: 8, borderLeftWidth: 4, marginBottom: 16 },
  aiTipText: { fontSize: 13, color: '#333', fontStyle: 'italic', lineHeight: 18 },
  actionsRow: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, paddingVertical: 10 },
});
