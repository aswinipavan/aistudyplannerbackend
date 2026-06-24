import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Theme } from '../../theme';
import { AppInput } from '../../components/common/AppInput';
import { AppButton } from '../../components/common/AppButton';
import { AppText } from '../../components/common/AppText';
import { useToastStore } from '../../store/toastStore';
import { useAddMark } from './hooks/usePerformance';
import { useSubjects } from '../subjects/hooks/useSubjects';

const markSchema = z.object({
  subjectId: z.string().min(1, 'Subject is required'),
  testName: z.string().min(1, 'Test name is required'),
  score: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0,
    'Score must be a positive number',
  ),
  maxScore: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    'Max score must be greater than 0',
  ),
});

type MarkFormData = z.infer<typeof markSchema>;

export const AddMarkScreen = () => {
  const navigation = useNavigation();
  const { showToast } = useToastStore();
  const addMarkMutation = useAddMark();
  const { data: subjects, isLoading: subjectsLoading } = useSubjects();

  // Track which subject name is displayed for the picker
  const [selectedSubjectName, setSelectedSubjectName] = useState('');

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<MarkFormData>({
    resolver: zodResolver(markSchema),
    defaultValues: { subjectId: '', testName: '', score: '', maxScore: '100' },
  });

  const onSubmit = (data: MarkFormData) => {
    addMarkMutation.mutate(
      {
        subjectId: data.subjectId,
        testName: data.testName,
        score: Number(data.score),
        maxScore: Number(data.maxScore),
        date: new Date().toISOString().split('T')[0],
      },
      {
        onSuccess: () => {
          showToast(`Score recorded: ${data.score}/${data.maxScore}!`, 'success');
          navigation.goBack();
        },
        onError: () => {
          showToast('Failed to save score. Please try again.', 'error');
        },
      },
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Subject Picker */}
      <AppText variant="caption" style={styles.label}>Subject</AppText>
      {subjectsLoading ? (
        <ActivityIndicator color={Theme.light.colors.primary} style={{ marginBottom: Theme.light.spacing.md }} />
      ) : subjects && subjects.length > 0 ? (
        <View style={styles.subjectPickerContainer}>
          {subjects.map((sub) => {
            const isSelected = selectedSubjectName === sub.name;
            return (
              <TouchableOpacity
                key={sub.id}
                style={[styles.subjectChip, isSelected && styles.subjectChipActive]}
                onPress={() => {
                  setSelectedSubjectName(sub.name);
                  setValue('subjectId', sub.id, { shouldValidate: true });
                }}
              >
                <AppText
                  variant="caption"
                  style={[styles.subjectChipText, isSelected && styles.subjectChipTextActive]}
                >
                  {sub.name}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <AppText variant="caption" color="secondary" style={{ marginBottom: Theme.light.spacing.md }}>
          No subjects found. Add subjects first.
        </AppText>
      )}
      {/* Hidden controller to track validation of subjectId */}
      <Controller
        control={control}
        name="subjectId"
        render={() => <></>}
      />
      {errors.subjectId && (
        <AppText variant="caption" color="error" style={{ marginBottom: Theme.light.spacing.sm }}>
          {errors.subjectId.message}
        </AppText>
      )}

      {/* Test Name */}
      <Controller
        control={control}
        name="testName"
        render={({ field: { onChange, value } }) => (
          <AppInput
            label="Test Name"
            placeholder="e.g. Midterm, Quiz 1"
            value={value}
            onChangeText={onChange}
            error={errors.testName?.message}
          />
        )}
      />

      {/* Score Row */}
      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: Theme.light.spacing.sm }}>
          <Controller
            control={control}
            name="score"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="Your Score"
                placeholder="0"
                value={value}
                onChangeText={onChange}
                error={errors.score?.message}
                keyboardType="numeric"
              />
            )}
          />
        </View>
        <View style={{ flex: 1, marginLeft: Theme.light.spacing.sm }}>
          <Controller
            control={control}
            name="maxScore"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="Max Score"
                placeholder="100"
                value={value}
                onChangeText={onChange}
                error={errors.maxScore?.message}
                keyboardType="numeric"
              />
            )}
          />
        </View>
      </View>

      <AppButton
        label={addMarkMutation.isPending ? 'Saving...' : 'Save Score'}
        onPress={handleSubmit(onSubmit)}
        disabled={addMarkMutation.isPending}
        style={{ marginTop: Theme.light.spacing.xl }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.light.colors.background },
  content: { padding: Theme.light.spacing.lg },
  label: {
    color: Theme.light.colors.textSecondary,
    marginBottom: Theme.light.spacing.sm,
  },
  subjectPickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.light.spacing.sm,
    marginBottom: Theme.light.spacing.md,
  },
  subjectChip: {
    paddingVertical: Theme.light.spacing.sm,
    paddingHorizontal: Theme.light.spacing.md,
    borderRadius: 20,
    backgroundColor: Theme.light.colors.surface,
    borderWidth: 1,
    borderColor: Theme.light.colors.border,
  },
  subjectChipActive: {
    backgroundColor: Theme.light.colors.primary,
    borderColor: Theme.light.colors.primary,
  },
  subjectChipText: {
    color: Theme.light.colors.textSecondary,
  },
  subjectChipTextActive: {
    color: Theme.light.colors.surface,
    fontWeight: 'bold',
  },
  row: { flexDirection: 'row' },
});
