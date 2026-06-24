import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Subject } from '../../types/api.types';
import { useSubjects } from './hooks/useSubjects';
import { usePerformanceReport } from '../performance/hooks/usePerformance';
import { SubjectsStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/useTheme';
import { SkeletonCard } from '../../components/skeleton/SkeletonCard';
import { ErrorState } from '../../components/common/ErrorState';
import { SubjectCard } from '../../components/common/SubjectCard';

type NavigationProp = NativeStackNavigationProp<SubjectsStackParamList, 'SubjectsList'>;

const SubjectListSkeleton = ({ count }: { count: number }) => (
  <>
    {Array(count).fill(0).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </>
);

export const SubjectsListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { data: subjects, isLoading: subjectsLoading, isError, refetch } = useSubjects();
  const { data: performanceReport, isLoading: performanceLoading } = usePerformanceReport();
  const { theme, typography, spacing } = useTheme();

  if (subjectsLoading || performanceLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, padding: spacing.lg }]}>
        <Text style={[typography.h1, { color: theme.text.primary, marginBottom: spacing.lg }]}>My Subjects</Text>
        <SubjectListSkeleton count={5} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ErrorState onRetry={refetch} message="Failed to load subjects" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background, padding: spacing.lg }]}>
      <Text style={[typography.h1, { color: theme.text.primary, marginBottom: spacing.lg }]}>My Subjects</Text>
      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const perf = performanceReport?.subjectBreakdown.find(p => p.subjectId === item.id);
          return (
            <SubjectCard 
              subject={item} 
              performance={perf}
              onPressDetail={() => navigation.navigate('SubjectDetail', { subjectId: item.id })} 
            />
          );
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={[typography.body, { color: theme.text.secondary, textAlign: 'center', marginTop: 40 }]}>
            No subjects added yet.
          </Text>
        }
      />
      
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: theme.primary, bottom: spacing.xl, right: spacing.lg }]}
        onPress={() => navigation.navigate('AddSubject')}
      >
        <Text style={[styles.fabIcon, { color: theme.surface }]}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  fabIcon: { fontSize: 32, lineHeight: 34, fontWeight: '300' }
});
