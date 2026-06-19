import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGenerateTimetable } from './hooks/useTimetable';
import { useSubjects } from '../subjects/hooks/useSubjects';
import { Theme } from '../../theme';

export const GenerateTimetableScreen = () => {
  const navigation = useNavigation<any>();
  const generateMutation = useGenerateTimetable();
  const { data: subjects, isLoading: subjectsLoading } = useSubjects();

  const [availableHours, setAvailableHours] = useState(4);
  const [style, setStyle] = useState<'intense' | 'balanced' | 'relaxed'>('balanced');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const handleGenerate = () => {
    if (selectedSubjects.length === 0) return;

    generateMutation.mutate({
      availableHours,
      style,
      subjectIds: selectedSubjects,
      startDate: new Date().toISOString().split('T')[0],
      durationDays: 7, // Default 1 week
    }, {
      onSuccess: () => {
        // Navigate to Timetable tab/screen
        navigation.navigate('TimetableList');
      }
    });
  };

  const toggleSubject = (id: string) => {
    setSelectedSubjects(prev => 
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Generate Timetable</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Hours per Day: {availableHours}</Text>
        <View style={styles.hoursRow}>
          {[2, 4, 6, 8, 10].map(h => (
            <TouchableOpacity 
              key={h} 
              style={[styles.hourChip, availableHours === h && styles.chipActive]}
              onPress={() => setAvailableHours(h)}
            >
              <Text style={[styles.chipText, availableHours === h && styles.chipTextActive]}>{h}h</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Study Style</Text>
        <View style={styles.styleRow}>
          {(['intense', 'balanced', 'relaxed'] as const).map(s => (
            <TouchableOpacity 
              key={s} 
              style={[styles.styleChip, style === s && styles.chipActive]}
              onPress={() => setStyle(s)}
            >
              <Text style={[styles.chipText, style === s && styles.chipTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Subjects</Text>
        {subjectsLoading ? (
           <ActivityIndicator color={Theme.light.colors.primary} />
        ) : (
          subjects?.map(sub => (
            <TouchableOpacity 
              key={sub.id} 
              style={[styles.subjectRow, selectedSubjects.includes(sub.id) && styles.subjectRowActive]}
              onPress={() => toggleSubject(sub.id)}
            >
              <Text style={[styles.subjectText, selectedSubjects.includes(sub.id) && styles.chipTextActive]}>
                {sub.name}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      <TouchableOpacity 
        style={styles.generateButton}
        onPress={handleGenerate}
        disabled={generateMutation.isPending || selectedSubjects.length === 0}
      >
        {generateMutation.isPending ? (
          <ActivityIndicator color={Theme.light.colors.surface} />
        ) : (
          <Text style={styles.generateButtonText}>Generate Timetable</Text>
        )}
      </TouchableOpacity>
      <View style={{height: 40}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.light.colors.background,
    padding: Theme.light.spacing.lg,
  },
  header: {
    ...Theme.light.typography.h1,
    color: Theme.light.colors.text,
    marginBottom: Theme.light.spacing.xl,
  },
  section: {
    marginBottom: Theme.light.spacing.xl,
  },
  sectionTitle: {
    ...Theme.light.typography.h3,
    color: Theme.light.colors.text,
    marginBottom: Theme.light.spacing.md,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  styleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hourChip: {
    paddingVertical: Theme.light.spacing.sm,
    paddingHorizontal: Theme.light.spacing.md,
    borderRadius: 20,
    backgroundColor: Theme.light.colors.surface,
    borderWidth: 1,
    borderColor: Theme.light.colors.border,
  },
  styleChip: {
    flex: 1,
    marginHorizontal: Theme.light.spacing.xs,
    paddingVertical: Theme.light.spacing.sm,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: Theme.light.colors.surface,
    borderWidth: 1,
    borderColor: Theme.light.colors.border,
  },
  chipActive: {
    backgroundColor: Theme.light.colors.primary,
    borderColor: Theme.light.colors.primary,
  },
  chipText: {
    ...Theme.light.typography.body,
    color: Theme.light.colors.textSecondary,
    textTransform: 'capitalize',
  },
  chipTextActive: {
    color: Theme.light.colors.surface,
    fontWeight: 'bold',
  },
  subjectRow: {
    padding: Theme.light.spacing.md,
    backgroundColor: Theme.light.colors.surface,
    borderWidth: 1,
    borderColor: Theme.light.colors.border,
    borderRadius: 8,
    marginBottom: Theme.light.spacing.sm,
  },
  subjectRowActive: {
    backgroundColor: Theme.light.colors.primary,
    borderColor: Theme.light.colors.primary,
  },
  subjectText: {
    ...Theme.light.typography.body,
    color: Theme.light.colors.text,
  },
  generateButton: {
    backgroundColor: Theme.light.colors.primary,
    padding: Theme.light.spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: Theme.light.spacing.md,
  },
  generateButtonText: {
    ...Theme.light.typography.h3,
    color: Theme.light.colors.surface,
  }
});
