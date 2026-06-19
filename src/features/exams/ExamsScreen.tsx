import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useExams } from './hooks/useExams';
import { useTheme } from '../../theme/useTheme';
import { AppText } from '../../components/common/AppText';
import { AppCard } from '../../components/common/AppCard';
import { EmptyState } from '../../components/common/EmptyState';
import { SkeletonList } from '../../components/skeleton/SkeletonList';

export const ExamsScreen = () => {
  const { data: exams, isLoading } = useExams();
  const navigation = useNavigation<any>();
  const { theme, spacing } = useTheme();

  const getDaysRemaining = (examDate: string) => {
    const diff = new Date(examDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  if (isLoading) return <View style={{ padding: spacing.md }}><SkeletonList /></View>;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={exams || []}
        contentContainerStyle={{ padding: spacing.md }}
        ListEmptyComponent={
          <EmptyState 
            title="No Upcoming Exams" 
            description="You don't have any exams scheduled yet."
            actionLabel="Add Exam"
            onAction={() => navigation.navigate('AddExam')}
          />
        }
        renderItem={({ item }) => {
          const daysLeft = getDaysRemaining(item.examDate);
          return (
            <AppCard>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <AppText variant="h3">{item.subject?.name || 'Unknown Subject'}</AppText>
                  <AppText variant="caption" color="secondary">
                    {new Date(item.examDate).toLocaleDateString()}
                  </AppText>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <AppText variant="h2" color={daysLeft <= 3 ? 'error' : 'primary'}>
                    {daysLeft}
                  </AppText>
                  <AppText variant="caption">Days Left</AppText>
                </View>
              </View>
            </AppCard>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
