import { useEffect } from 'react';
import { initializeApp } from 'firebase/app';          // <-- correct import
import { getMessaging, getToken, onMessage } from 'firebase/messaging'; // <-- messaging functions
import API from '../services/api';

// Your Firebase configuration – use the same config from firebase-messaging-sw.js
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
let messaging;
try {
  messaging = getMessaging(app);
} catch (e) {
  console.error('Firebase messaging not available (non-HTTPS or service worker missing)', e);
}

export default function useFCMToken(vapidKey) {
  useEffect(() => {
    if (!messaging || !vapidKey) return;

    Notification.requestPermission().then(async (permission) => {
      if (permission === 'granted') {
        try {
          const currentToken = await getToken(messaging, { vapidKey });
          if (currentToken) {
            // Send token to backend
            await API.put('/auth/fcm-token', { fcmToken: currentToken });
            console.log('FCM token saved');
          }
        } catch (err) {
          console.error('Error getting FCM token', err);
        }
      }
    });

    // Handle foreground messages
    onMessage(messaging, (payload) => {
      console.log('Foreground message:', payload);
      // Optional: show an in-app notification
      if (Notification.permission === 'granted') {
        new Notification(payload.notification.title, { body: payload.notification.body });
      }
    });
  }, [vapidKey]);
}