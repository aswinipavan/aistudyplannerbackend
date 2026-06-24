import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useAuthStore } from '../../store/authStore';
import { studentsApi } from '../../api/students.api';
import { Theme } from '../../theme';
import { AppText } from '../../components/common/AppText';
import { AppInput } from '../../components/common/AppInput';
import { AppButton } from '../../components/common/AppButton';
import { useToastStore } from '../../store/toastStore';

export const ProfileScreen = () => {
  const { user, completeOnboarding } = useAuthStore();
  const { showToast } = useToastStore();
  const navigation = useNavigation();

  const [name, setName] = useState(user?.name || '');
  const [photoUri, setPhotoUri] = useState(user?.photoUrl || '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handlePickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (!result.assets || result.assets.length === 0) return;

    const localUri = result.assets[0].uri || '';
    if (!localUri) return;

    // Show the local image immediately for instant feedback
    setPhotoUri(localUri);
    setUploading(true);

    try {
      // Upload to backend API and get back the cloud URL
      const cloudUrl = await studentsApi.uploadProfilePhoto(localUri);
      setPhotoUri(cloudUrl);
      showToast('Photo uploaded successfully!', 'success');
    } catch (err) {
      showToast('Failed to upload photo. Please try again.', 'error');
      // Revert to previous photo on failure
      setPhotoUri(user?.photoUrl || '');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await studentsApi.updateProfile({
        name,
        grade: user?.grade || '1',
        examBoard: '',
        photoUrl: photoUri,
      });
      // Sync local auth store with updated values
      completeOnboarding({ name, photoUrl: photoUri });
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to save profile. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarSection}>
        <TouchableOpacity onPress={handlePickImage} style={styles.avatarContainer} disabled={uploading}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <AppText variant="h1" color="white">
                {name.charAt(0).toUpperCase() || 'S'}
              </AppText>
            </View>
          )}
          <View style={styles.editBadge}>
            {uploading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <AppText variant="caption" color="white">Edit</AppText>
            )}
          </View>
        </TouchableOpacity>
        <AppText variant="h3" style={{ marginTop: Theme.light.spacing.md }}>
          {user?.email || 'student@example.com'}
        </AppText>
        {user?.isPremium && (
          <AppText variant="caption" color="primary" style={{ marginTop: 4, fontWeight: 'bold' }}>
            PRO MEMBER
          </AppText>
        )}
      </View>

      <View style={styles.formSection}>
        <AppInput
          label="Display Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />

        <AppButton
          label={saving ? "Saving..." : "Save Changes"}
          onPress={handleSave}
          disabled={saving || uploading || !name.trim()}
          style={{ marginTop: Theme.light.spacing.xl }}
        />

        <AppButton
          label="View Advanced Analytics"
          onPress={() => (navigation as any).navigate('Analytics')}
          style={{ marginTop: Theme.light.spacing.md, backgroundColor: Theme.light.colors.secondary }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.light.colors.background },
  content: { padding: Theme.light.spacing.lg, paddingTop: 40 },
  avatarSection: { alignItems: 'center', marginBottom: Theme.light.spacing.xxl },
  avatarContainer: { position: 'relative' },
  avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: Theme.light.colors.surface },
  avatarPlaceholder: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: Theme.light.colors.primary,
    justifyContent: 'center', alignItems: 'center'
  },
  editBadge: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: Theme.light.colors.text,
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 12,
    minWidth: 32,
    alignItems: 'center',
  },
  formSection: { flex: 1 },
});
