import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { Subject } from '../../types/api.types';

interface SubjectCardProps {
  subject: Subject;
  onPress: () => void;
}

export const SubjectCard = ({ subject, onPress }: SubjectCardProps) => {
  const { theme, typography } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.text.primary }]}
      onPress={onPress}
    >
      <View style={[styles.colorStrip, { backgroundColor: subject.color }]} />
      <View style={styles.cardContent}>
        <Text style={[typography.h2, { color: theme.text.primary }]}>{subject.name}</Text>
        <Text style={[typography.body, { color: theme.text.secondary, marginTop: 4 }]}>
          Studied: {subject.totalHoursStudied}h
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', borderRadius: 12, marginBottom: 16, overflow: 'hidden',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2,
  },
  colorStrip: { width: 8 },
  cardContent: { padding: 16, flex: 1 },
});
