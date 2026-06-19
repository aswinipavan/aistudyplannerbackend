import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { useAddSubject } from './hooks/useSubjects';
import { useTheme } from '../../theme/useTheme';
import { subjectSchema, SubjectFormData } from './schemas/subjectSchema';
import { AppInput } from '../../components/common/AppInput';
import { AppButton } from '../../components/common/AppButton';

const COLORS = ['#FF5722', '#2196F3', '#4CAF50', '#9C27B0', '#FFC107', '#E91E63'];

export const AddSubjectScreen = () => {
  const navigation = useNavigation();
  const { theme, typography, spacing } = useTheme();
  
  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: { color: COLORS[0] }
  });

  const selectedColor = watch('color');
  const addSubjectMutation = useAddSubject();

  const onSubmit = (data: SubjectFormData) => {
    addSubjectMutation.mutate(data as any, {
      onSuccess: () => navigation.goBack()
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background, padding: spacing.lg }]}>
      <Text style={[typography.h1, { color: theme.text.primary, marginBottom: spacing.xl }]}>Add New Subject</Text>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <AppInput
            label="Subject Name"
            placeholder="e.g. Biology"
            value={value}
            onChangeText={onChange}
            error={errors.name?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="targetHours"
        render={({ field: { onChange, value } }) => (
          <AppInput
            label="Target Study Hours (Optional)"
            placeholder="e.g. 5"
            keyboardType="numeric"
            value={value ? String(value) : ''}
            onChangeText={(text) => onChange(text ? Number(text) : undefined)}
            error={errors.targetHours?.message}
          />
        )}
      />

      <View style={[styles.formGroup, { marginBottom: spacing.lg }]}>
        <Text style={[typography.caption, { color: theme.text.secondary, marginBottom: spacing.xs }]}>Color</Text>
        <View style={styles.colorPicker}>
          {COLORS.map((hex) => (
            <TouchableOpacity 
              key={hex} 
              style={[
                styles.colorSwatch, 
                { backgroundColor: hex }, 
                selectedColor === hex && { borderColor: theme.text.primary }
              ]}
              onPress={() => setValue('color', hex, { shouldValidate: true })}
            />
          ))}
        </View>
        {errors.color && <Text style={[typography.small, { color: theme.error, marginTop: 4 }]}>{errors.color.message}</Text>}
      </View>

      <AppButton 
        label="Save Subject" 
        onPress={handleSubmit(onSubmit)} 
        loading={addSubjectMutation.isPending}
        style={{ marginTop: spacing.xl }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  formGroup: {},
  colorPicker: { flexDirection: 'row', gap: 12, marginTop: 8 },
  colorSwatch: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: 'transparent' },
});
