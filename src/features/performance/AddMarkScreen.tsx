import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Theme } from '../../theme';
import { AppInput } from '../../components/common/AppInput';
import { AppButton } from '../../components/common/AppButton';
import { useToastStore } from '../../store/toastStore';

const markSchema = z.object({
  subjectId: z.string().min(1, 'Subject is required'),
  testName: z.string().min(1, 'Test name is required'),
  score: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, 'Score must be a positive number'),
  maxScore: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Max score must be greater than 0'),
});

type MarkFormData = z.infer<typeof markSchema>;

export const AddMarkScreen = () => {
  const navigation = useNavigation();
  const { showToast } = useToastStore();
  
  const { control, handleSubmit, formState: { errors } } = useForm<MarkFormData>({
    resolver: zodResolver(markSchema),
    defaultValues: { score: '', maxScore: '100' }
  });

  const onSubmit = (data: MarkFormData) => {
    // Simulated API call success
    setTimeout(() => {
      showToast(`Score recorded: ${data.score}/${data.maxScore}!`, 'success');
      navigation.goBack();
    }, 500);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Controller
        control={control}
        name="subjectId"
        render={({ field: { onChange, value } }) => (
          <AppInput 
            label="Subject ID" 
            placeholder="e.g. sub_123" 
            value={value} 
            onChangeText={onChange} 
            error={errors.subjectId?.message} 
          />
        )}
      />
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
        label="Save Score" 
        onPress={handleSubmit(onSubmit)} 
        style={{ marginTop: Theme.light.spacing.xl }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.light.colors.background },
  content: { padding: Theme.light.spacing.lg },
  row: { flexDirection: 'row' }
});
