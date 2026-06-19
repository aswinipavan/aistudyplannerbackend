import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Theme } from '../../theme';
import { studentsApi } from '../../api/students.api';
import { useAuthStore } from '../../store/authStore';

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  grade: z.string().min(1, "Grade is required"),
  examBoard: z.string().min(1, "Exam board is required"),
});

type FormData = z.infer<typeof schema>;

export const OnboardingScreen = () => {
  const { completeOnboarding } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await studentsApi.updateProfile(data);
      // Assuming successful profile setup, complete login
      completeOnboarding(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Profile</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Name</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <TextInput style={styles.input} onChangeText={onChange} value={value} placeholder="e.g. John Doe" />
          )}
        />
        {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Grade</Text>
        <Controller
          control={control}
          name="grade"
          render={({ field: { onChange, value } }) => (
            <TextInput style={styles.input} onChangeText={onChange} value={value} placeholder="e.g. 10th Grade" />
          )}
        />
        {errors.grade && <Text style={styles.error}>{errors.grade.message}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Exam Board</Text>
        <Controller
          control={control}
          name="examBoard"
          render={({ field: { onChange, value } }) => (
            <TextInput style={styles.input} onChangeText={onChange} value={value} placeholder="e.g. CBSE / IGCSE" />
          )}
        />
        {errors.examBoard && <Text style={styles.error}>{errors.examBoard.message}</Text>}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} disabled={loading}>
        {loading ? <ActivityIndicator color={Theme.light.colors.surface} /> : <Text style={styles.buttonText}>Save Profile</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.light.colors.background, padding: Theme.light.spacing.lg, justifyContent: 'center' },
  title: { ...Theme.light.typography.h1, color: Theme.light.colors.text, marginBottom: Theme.light.spacing.xl },
  formGroup: { marginBottom: Theme.light.spacing.md },
  label: { ...Theme.light.typography.caption, color: Theme.light.colors.textSecondary, marginBottom: Theme.light.spacing.xs },
  input: {
    backgroundColor: Theme.light.colors.surface,
    borderColor: Theme.light.colors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: Theme.light.spacing.md,
    ...Theme.light.typography.body,
  },
  error: { color: Theme.light.colors.error, ...Theme.light.typography.small, marginTop: 4 },
  button: {
    backgroundColor: Theme.light.colors.primary,
    padding: Theme.light.spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: Theme.light.spacing.lg,
  },
  buttonText: { ...Theme.light.typography.h3, color: Theme.light.colors.surface }
});
