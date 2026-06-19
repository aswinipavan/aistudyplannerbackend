import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { subjectsApi } from '../../api/subjects.api';
import { SubjectsStackParamList } from '../../navigation/types';
import { Theme } from '../../theme';
import { useDeleteSubject } from './hooks/useSubjects';
import { AppButton } from '../../components/common/AppButton';
import { useToastStore } from '../../store/toastStore';

type RouteProps = RouteProp<SubjectsStackParamList, 'SubjectDetail'>;

export const SubjectDetailScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation();
  const { subjectId } = route.params;
  
  const { mutate: deleteSubject, isPending: isDeleting } = useDeleteSubject();
  const { showToast } = useToastStore();

  const { data: subject, isLoading, error } = useQuery({
    queryKey: ['subject', subjectId],
    queryFn: () => subjectsApi.getById(subjectId),
  });

  if (isLoading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={Theme.light.colors.primary} /></View>;
  }

  if (error || !subject) {
    return <View style={styles.center}><Text style={styles.error}>Failed to load subject</Text></View>;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: subject.color }]}>
        <Text style={styles.headerTitle}>{subject.name}</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Total Hours</Text>
          <Text style={styles.statValue}>{subject.totalHoursStudied}h</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Priority Score</Text>
          <Text style={styles.statValue}>{subject.priorityScore}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Recent Materials</Text>
      <Text style={styles.placeholder}>Materials list will be here...</Text>

      <View style={styles.footer}>
        <AppButton 
          label={isDeleting ? "Deleting..." : "Delete Subject"} 
          onPress={() => {
            Alert.alert('Delete Subject', `Are you sure you want to delete ${subject.name}?`, [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => {
                  deleteSubject(subjectId, {
                    onSuccess: () => {
                      showToast('Subject deleted successfully', 'success');
                      navigation.goBack();
                    },
                    onError: () => {
                      showToast('Failed to delete subject', 'error');
                    }
                  });
              }}
            ]);
          }} 
          disabled={isDeleting}
          style={{ backgroundColor: Theme.light.colors.error }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.light.colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: Theme.light.colors.error, ...Theme.light.typography.body },
  
  header: { padding: Theme.light.spacing.xl, paddingTop: 60, paddingBottom: 40 },
  headerTitle: { ...Theme.light.typography.h1, color: Theme.light.colors.surface },

  statsContainer: { flexDirection: 'row', padding: Theme.light.spacing.lg, gap: Theme.light.spacing.md, marginTop: -20 },
  statBox: { 
    flex: 1, 
    backgroundColor: Theme.light.colors.surface, 
    padding: Theme.light.spacing.md, 
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statLabel: { ...Theme.light.typography.caption, color: Theme.light.colors.textSecondary },
  statValue: { ...Theme.light.typography.h2, color: Theme.light.colors.text, marginTop: 4 },

  sectionTitle: { ...Theme.light.typography.h3, color: Theme.light.colors.text, marginTop: Theme.light.spacing.lg, paddingHorizontal: Theme.light.spacing.lg },
  placeholder: { ...Theme.light.typography.body, color: Theme.light.colors.textSecondary, padding: Theme.light.spacing.lg, fontStyle: 'italic' },
  footer: { padding: Theme.light.spacing.lg, marginTop: 'auto' }
});
