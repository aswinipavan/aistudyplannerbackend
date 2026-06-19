import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Theme } from '../../theme';
import { useActiveTimetable, useUpdateSlotStatus } from './hooks/useTimetable';
import { TimetableSlot } from '../../types/api.types';
import { useNavigation } from '@react-navigation/native';

export const TimetableScreen = () => {
  const { data: slots, isLoading, error } = useActiveTimetable();
  const updateMutation = useUpdateSlotStatus();
  const navigation = useNavigation<any>();

  const handleToggleStatus = (slot: TimetableSlot) => {
    const newStatus = slot.status === 'completed' ? 'pending' : 'completed';
    updateMutation.mutate({ slotId: slot.id, status: newStatus });
  };

  const renderSlot = ({ item }: { item: TimetableSlot }) => {
    const isCompleted = item.status === 'completed';
    return (
      <View style={[styles.slotCard, isCompleted && styles.slotCardCompleted]}>
        <View style={styles.timeColumn}>
          <Text style={styles.timeText}>{item.startTime}</Text>
          <View style={styles.timeLine} />
          <Text style={styles.timeText}>{item.endTime}</Text>
        </View>
        <View style={styles.detailsColumn}>
          <Text style={[styles.subjectTitle, isCompleted && styles.textCompleted]}>Subject: {item.subjectId}</Text>
          <Text style={styles.dateText}>{item.date}</Text>
          
          <TouchableOpacity 
            style={[styles.statusButton, isCompleted && styles.statusButtonCompleted]}
            onPress={() => handleToggleStatus(item)}
          >
            <Text style={[styles.statusText, isCompleted && styles.statusTextCompleted]}>
              {isCompleted ? 'Completed' : 'Mark Complete'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return <ActivityIndicator style={{ flex: 1 }} color={Theme.light.colors.primary} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Today's Schedule</Text>
        <TouchableOpacity onPress={() => navigation.navigate('GenerateTimetable')}>
          <Text style={styles.generateLink}>+ Generate</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={slots}
        keyExtractor={item => item.id}
        renderItem={renderSlot}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No timetable generated for today.</Text>
            <TouchableOpacity style={styles.generateBtn} onPress={() => navigation.navigate('GenerateTimetable')}>
              <Text style={styles.generateBtnText}>Generate Now</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.light.colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.light.spacing.lg,
  },
  header: {
    ...Theme.light.typography.h1,
    color: Theme.light.colors.text,
  },
  generateLink: {
    ...Theme.light.typography.body,
    color: Theme.light.colors.primary,
    fontWeight: 'bold',
  },
  listContent: {
    padding: Theme.light.spacing.md,
  },
  slotCard: {
    flexDirection: 'row',
    backgroundColor: Theme.light.colors.surface,
    borderRadius: 16,
    padding: Theme.light.spacing.md,
    marginBottom: Theme.light.spacing.md,
    borderWidth: 1,
    borderColor: Theme.light.colors.border,
  },
  slotCardCompleted: {
    opacity: 0.7,
    backgroundColor: '#F0F0F0',
  },
  timeColumn: {
    alignItems: 'center',
    width: 60,
    marginRight: Theme.light.spacing.md,
  },
  timeText: {
    ...Theme.light.typography.caption,
    color: Theme.light.colors.textSecondary,
    fontWeight: 'bold',
  },
  timeLine: {
    width: 2,
    flex: 1,
    backgroundColor: Theme.light.colors.border,
    marginVertical: 4,
  },
  detailsColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  subjectTitle: {
    ...Theme.light.typography.h3,
    color: Theme.light.colors.text,
    marginBottom: 4,
  },
  textCompleted: {
    textDecorationLine: 'line-through',
    color: Theme.light.colors.textSecondary,
  },
  dateText: {
    ...Theme.light.typography.caption,
    color: Theme.light.colors.textSecondary,
    marginBottom: Theme.light.spacing.sm,
  },
  statusButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: Theme.light.spacing.md,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: Theme.light.colors.background,
    borderWidth: 1,
    borderColor: Theme.light.colors.primary,
  },
  statusButtonCompleted: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Theme.light.colors.primary,
  },
  statusTextCompleted: {
    color: '#4CAF50',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    ...Theme.light.typography.body,
    color: Theme.light.colors.textSecondary,
    marginBottom: 20,
  },
  generateBtn: {
    backgroundColor: Theme.light.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  generateBtnText: {
    color: 'white',
    fontWeight: 'bold',
  }
});
