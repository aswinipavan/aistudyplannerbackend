import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import { examSchema, ExamFormData } from './schemas/examSchema';
import { useCreateExam } from './hooks/useExams';
import { useToastStore } from '../../store/toastStore';
import { useTheme } from '../../theme/useTheme';
import { AppInput } from '../../components/common/AppInput';
import { AppButton } from '../../components/common/AppButton';
import { AppText } from '../../components/common/AppText';

export const AddExamScreen = () => {
  const navigation = useNavigation();
  const { theme, spacing } = useTheme();
  const { showToast } = useToastStore();
  const { mutate: createExam, isPending } = useCreateExam();
  
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
    defaultValues: { difficulty: 'medium', examDate: new Date() }
  });

  const onSubmit = (data: ExamFormData) => {
    createExam({
      ...data,
      examDate: data.examDate.toISOString()
    }, {
      onSuccess: () => {
        showToast('Exam scheduled successfully!', 'success');
        navigation.goBack();
      },
      onError: () => {
        showToast('Failed to schedule exam', 'error');
      }
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={{ padding: spacing.lg }}>
      <Controller
        control={control}
        name="subjectId"
        render={({ field: { onChange, value } }) => (
          <AppInput 
            label="Subject ID" 
            placeholder="Enter Subject ID" 
            value={value} 
            onChangeText={onChange} 
            error={errors.subjectId?.message} 
          />
        )}
      />

      <Controller
        control={control}
        name="examDate"
        render={({ field: { onChange, value } }) => (
          <View style={{ marginBottom: spacing.md }}>
            <AppText variant="body" color="secondary" style={{ marginBottom: spacing.xs }}>Exam Date</AppText>
            <TouchableOpacity onPress={() => setDatePickerOpen(true)} style={[styles.dateButton, { borderColor: theme.border, backgroundColor: theme.surface }]}>
              <AppText>{value.toLocaleDateString()}</AppText>
            </TouchableOpacity>
            {errors.examDate && <AppText variant="caption" color="error">{errors.examDate.message}</AppText>}
            <DatePicker
              modal
              open={datePickerOpen}
              date={value}
              onConfirm={(date) => {
                setDatePickerOpen(false);
                onChange(date);
              }}
              onCancel={() => setDatePickerOpen(false)}
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, value } }) => (
          <AppInput 
            label="Notes" 
            placeholder="Chapters, topics to cover..." 
            value={value || ''} 
            onChangeText={onChange} 
            error={errors.notes?.message} 
          />
        )}
      />

      <AppButton 
        label={isPending ? "Scheduling..." : "Schedule Exam"} 
        onPress={handleSubmit(onSubmit)} 
        disabled={isPending} 
        style={{ marginTop: spacing.xl }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  dateButton: { padding: 12, borderRadius: 8, borderWidth: 1 }
});
