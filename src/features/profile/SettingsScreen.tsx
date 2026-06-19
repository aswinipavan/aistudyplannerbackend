import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { Theme } from '../../theme';
import { AppText } from '../../components/common/AppText';
import { AppButton } from '../../components/common/AppButton';

export const SettingsScreen = () => {
  const { logout } = useAuthStore();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [studyReminders, setStudyReminders] = useState(true);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => logout() }
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      <View style={styles.section}>
        <AppText variant="h3" style={styles.sectionTitle}>Preferences</AppText>
        
        <View style={styles.settingRow}>
          <AppText variant="body">Dark Mode</AppText>
          <Switch 
            value={darkMode} 
            onValueChange={setDarkMode}
            trackColor={{ true: Theme.light.colors.primary, false: Theme.light.colors.border }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <AppText variant="h3" style={styles.sectionTitle}>Notifications</AppText>
        
        <View style={styles.settingRow}>
          <View>
            <AppText variant="body">Push Notifications</AppText>
            <AppText variant="caption" color="secondary">Receive general app updates</AppText>
          </View>
          <Switch 
            value={notifications} 
            onValueChange={setNotifications}
            trackColor={{ true: Theme.light.colors.primary, false: Theme.light.colors.border }}
          />
        </View>

        <View style={styles.settingRow}>
          <View>
            <AppText variant="body">Study Reminders</AppText>
            <AppText variant="caption" color="secondary">Alerts for your scheduled sessions</AppText>
          </View>
          <Switch 
            value={studyReminders} 
            onValueChange={setStudyReminders}
            trackColor={{ true: Theme.light.colors.primary, false: Theme.light.colors.border }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <AppText variant="h3" style={styles.sectionTitle}>Account</AppText>
        
        <AppButton 
          label="Log Out" 
          onPress={handleLogout} 
          style={{ backgroundColor: Theme.light.colors.error, marginTop: Theme.light.spacing.md }}
        />
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.light.colors.background },
  content: { padding: Theme.light.spacing.lg },
  section: {
    backgroundColor: Theme.light.colors.surface,
    padding: Theme.light.spacing.lg,
    borderRadius: 16,
    marginBottom: Theme.light.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: { marginBottom: Theme.light.spacing.md, color: Theme.light.colors.primary },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.light.spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Theme.light.colors.border,
  }
});
