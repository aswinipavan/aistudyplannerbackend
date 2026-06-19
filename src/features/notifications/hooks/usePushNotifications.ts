import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { notificationsApi } from '../../../api/notifications.api';
import { logger } from '../../../utils/logger';

export const usePushNotifications = () => {
  useEffect(() => {
    const setupPushNotifications = async () => {
      try {
        logger.log('[usePushNotifications] Requesting permissions...');
        const authStatus = await messaging().requestPermission();
        
        if (authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL) {
          logger.log('[usePushNotifications] Getting FCM token...');
          const token = await messaging().getToken();
          
          await notificationsApi.registerFcmToken(token);
        }

        messaging().onMessage(async remoteMessage => {
          logger.log('[usePushNotifications] Subscribed to foreground messages:', remoteMessage);
        });

        messaging().onNotificationOpenedApp(remoteMessage => {
          logger.log('[usePushNotifications] Subscribed to background opens:', remoteMessage);
        });

        messaging().getInitialNotification().then(remoteMessage => {
          if (remoteMessage) {
            logger.log('[usePushNotifications] Checked cold start notifications:', remoteMessage);
          }
        });

      } catch (error) {
        logger.error('[usePushNotifications] Failed to setup push notifications:', error);
      }
    };

    setupPushNotifications();

    return () => {
      logger.log('[usePushNotifications] Unsubscribed from listeners');
    };
  }, []);
};
