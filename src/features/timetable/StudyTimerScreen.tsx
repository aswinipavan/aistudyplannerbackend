import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Alert, Text
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { Theme } from '../../theme';
import { AppText } from '../../components/common/AppText';
import { useToastStore } from '../../store/toastStore';
import { studySessionsApi } from '../../api/studySessions.api';
import { TimetableStackParamList } from '../../navigation/types';
import { TIMETABLE_ACTIVE_KEY } from './hooks/useTimetable';

type TimerRoute = RouteProp<TimetableStackParamList, 'StudyTimer'>;

type TimerState = 'idle' | 'running' | 'paused';
type TimerMode = 'stopwatch' | 'pomodoro25' | 'pomodoro50';

const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
};

const getInitialTime = (mode: TimerMode): number => {
  if (mode === 'pomodoro25') return 25 * 60;
  if (mode === 'pomodoro50') return 50 * 60;
  return 0; // Stopwatch starts at 0
};

export const StudyTimerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<TimerRoute>();
  const { showToast } = useToastStore();
  const qc = useQueryClient();

  const subjectId = route.params?.subjectId || '';
  const subjectName = route.params?.subjectName || 'Study Session';

  const [mode, setMode] = useState<TimerMode>('stopwatch');
  const [elapsed, setElapsed] = useState(0); // For stopwatch, counts up. For pomodoro, counts down.
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [saving, setSaving] = useState(false);

  // Productivity Tracking
  const [interruptions, setInterruptions] = useState(0);
  const totalStudiedSecondsRef = useRef(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTickRef = useRef<number>(0);

  const isCountdown = mode !== 'stopwatch';

  useEffect(() => {
    if (timerState === 'idle') {
      setElapsed(getInitialTime(mode));
    }
  }, [mode, timerState]);

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleStart = useCallback(() => {
    lastTickRef.current = Date.now();
    setTimerState('running');
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const delta = Math.floor((now - lastTickRef.current) / 1000);
      
      if (delta >= 1) {
        lastTickRef.current = now;
        totalStudiedSecondsRef.current += 1;
        
        setElapsed(prev => {
          if (isCountdown) {
            if (prev <= 1) {
              clearTimer();
              setTimerState('idle');
              Alert.alert('Time is up!', 'Take a break.');
              return 0;
            }
            return prev - 1;
          } else {
            return prev + 1;
          }
        });
      }
    }, 1000);
  }, [isCountdown]);

  const handlePause = useCallback(() => {
    clearTimer();
    setInterruptions(prev => prev + 1);
    setTimerState('paused');
  }, []);

  const handleResume = useCallback(() => {
    lastTickRef.current = Date.now();
    setTimerState('running');
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const delta = Math.floor((now - lastTickRef.current) / 1000);
      
      if (delta >= 1) {
        lastTickRef.current = now;
        totalStudiedSecondsRef.current += 1;
        
        setElapsed(prev => {
          if (isCountdown) {
            if (prev <= 1) {
              clearTimer();
              setTimerState('idle');
              Alert.alert('Time is up!', 'Take a break.');
              return 0;
            }
            return prev - 1;
          } else {
            return prev + 1;
          }
        });
      }
    }, 1000);
  }, [isCountdown]);

  const handleStop = useCallback(() => {
    clearTimer();
    const totalSeconds = totalStudiedSecondsRef.current;
    const totalMinutes = Math.max(1, Math.round(totalSeconds / 60));

    if (totalSeconds < 10) {
      navigation.goBack();
      return;
    }

    const productivityScore = Math.max(0, Math.min(100, 100 - (interruptions * 5)));

    Alert.alert(
      'Session Complete',
      `You studied for ${formatTime(totalSeconds)}.\nInterruptions: ${interruptions}\nProductivity: ${productivityScore}%`,
      [
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
        {
          text: 'Save',
          onPress: async () => {
            setSaving(true);
            try {
              await studySessionsApi.saveSession({
                subjectId,
                durationMinutes: totalMinutes,
                date: new Date().toISOString().split('T')[0],
                productivityScore,
                focusInterruptions: interruptions,
                studyMode: mode
              });
              qc.invalidateQueries({ queryKey: TIMETABLE_ACTIVE_KEY });
              qc.invalidateQueries({ queryKey: ['dashboardOverview'] });
              showToast(`Session saved successfully!`, 'success');
            } catch {
              showToast('Failed to save session.', 'error');
            } finally {
              setSaving(false);
              navigation.goBack();
            }
          },
        },
      ]
    );
  }, [subjectId, navigation, qc, showToast, interruptions, mode]);

  return (
    <View style={styles.container}>
      <AppText variant="h3" color="secondary" style={styles.subjectLabel}>
        {subjectName}
      </AppText>

      {timerState === 'idle' && (
        <View style={styles.modeContainer}>
          <TouchableOpacity 
            style={[styles.modeBtn, mode === 'stopwatch' && styles.modeBtnActive]} 
            onPress={() => setMode('stopwatch')}
          >
            <Text style={[styles.modeText, mode === 'stopwatch' && styles.modeTextActive]}>Stopwatch</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.modeBtn, mode === 'pomodoro25' && styles.modeBtnActive]} 
            onPress={() => setMode('pomodoro25')}
          >
            <Text style={[styles.modeText, mode === 'pomodoro25' && styles.modeTextActive]}>25m Pomodoro</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.modeBtn, mode === 'pomodoro50' && styles.modeBtnActive]} 
            onPress={() => setMode('pomodoro50')}
          >
            <Text style={[styles.modeText, mode === 'pomodoro50' && styles.modeTextActive]}>50m Pomodoro</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.timerDisplay}>
        <AppText variant="h1" style={styles.timerText}>
          {formatTime(elapsed)}
        </AppText>
        <AppText variant="caption" color="secondary" style={styles.statusLabel}>
          {timerState === 'idle' ? 'Ready to focus' :
           timerState === 'running' ? 'Focusing...' : 'Paused - Take a breath'}
        </AppText>
      </View>

      {/* Analytics Live Preview */}
      {timerState !== 'idle' && (
        <View style={styles.liveStats}>
          <Text style={styles.statsText}>Interruptions: {interruptions}</Text>
          <Text style={styles.statsText}>Efficiency: {Math.max(0, 100 - (interruptions * 5))}%</Text>
        </View>
      )}

      <View style={styles.controls}>
        {timerState === 'idle' && (
          <TouchableOpacity style={[styles.btn, styles.btnStart]} onPress={handleStart}>
            <AppText variant="h3" color="white">▶ Start</AppText>
          </TouchableOpacity>
        )}

        {timerState === 'running' && (
          <>
            <TouchableOpacity style={[styles.btn, styles.btnPause]} onPress={handlePause}>
              <AppText variant="h3" color="white">⏸ Pause</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnStop]} onPress={handleStop} disabled={saving}>
              <AppText variant="h3" color="white">⏹ Stop</AppText>
            </TouchableOpacity>
          </>
        )}

        {timerState === 'paused' && (
          <>
            <TouchableOpacity style={[styles.btn, styles.btnStart]} onPress={handleResume}>
              <AppText variant="h3" color="white">▶ Resume</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnStop]} onPress={handleStop} disabled={saving}>
              <AppText variant="h3" color="white">⏹ Stop</AppText>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.light.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.light.spacing.xl,
  },
  subjectLabel: {
    marginBottom: Theme.light.spacing.xl,
    textAlign: 'center',
  },
  modeContainer: {
    flexDirection: 'row',
    backgroundColor: Theme.light.colors.surface,
    borderRadius: 8,
    padding: 4,
    marginBottom: 40,
  },
  modeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  modeBtnActive: {
    backgroundColor: Theme.light.colors.primary,
  },
  modeText: {
    ...Theme.light.typography.small,
    color: Theme.light.colors.textSecondary,
    fontWeight: '600',
  },
  modeTextActive: {
    color: Theme.light.colors.surface,
  },
  timerDisplay: {
    alignItems: 'center',
    marginBottom: Theme.light.spacing.xl,
  },
  timerText: {
    fontSize: 72,
    fontWeight: '700',
    color: Theme.light.colors.primary,
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },
  statusLabel: {
    marginTop: Theme.light.spacing.sm,
  },
  liveStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
    backgroundColor: Theme.light.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  statsText: {
    ...Theme.light.typography.caption,
    color: Theme.light.colors.textSecondary,
  },
  controls: {
    flexDirection: 'row',
    gap: Theme.light.spacing.md,
  },
  btn: {
    paddingVertical: Theme.light.spacing.md,
    paddingHorizontal: Theme.light.spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 130,
  },
  btnStart: {
    backgroundColor: Theme.light.colors.primary,
  },
  btnPause: {
    backgroundColor: Theme.light.colors.textSecondary,
  },
  btnStop: {
    backgroundColor: Theme.light.colors.error,
  },
});
