// Push notification registration for Capacitor
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

export async function initPushNotifications(userId?: string) {
  if (!Capacitor.isNativePlatform()) {
    console.log('[Push] Not a native platform, skipping');
    return null;
  }

  try {
    // Request permission
    const permResult = await PushNotifications.requestPermissions();
    if (permResult.receive !== 'granted') {
      console.log('[Push] Permission not granted');
      return null;
    }

    // Register with FCM
    await PushNotifications.register();

    // Listen for token
    return new Promise<string>((resolve) => {
      PushNotifications.addListener('registration', async (token) => {
        console.log('[Push] FCM Token:', token.value);
        
        // Save token to server
        if (userId) {
          try {
            await fetch('/api/push-token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId, token: token.value, platform: 'android' }),
            });
            console.log('[Push] Token saved to server');
          } catch (e) {
            console.error('[Push] Failed to save token:', e);
          }
        }
        
        resolve(token.value);
      });

      PushNotifications.addListener('registrationError', (err) => {
        console.error('[Push] Registration failed:', err.error);
        resolve('');
      });

      // Handle incoming notifications when app is open
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('[Push] Received:', notification);
        // Could show in-app toast/banner here
      });

      // Handle notification tap (opens app)
      PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
        console.log('[Push] Action:', action);
        const data = action.notification.data;
        if (data?.url) {
          window.location.href = data.url;
        }
      });
    });
  } catch (e) {
    console.error('[Push] Init error:', e);
    return null;
  }
}

export function isPushAvailable(): boolean {
  return Capacitor.isNativePlatform();
}
