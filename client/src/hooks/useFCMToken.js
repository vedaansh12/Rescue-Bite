import { useEffect } from 'react';
import { initializeApp } from 'firebase/app';          // <-- correct import
import { getMessaging, getToken, onMessage } from 'firebase/messaging'; // <-- messaging functions
import API from '../services/api';

// Your Firebase configuration – use the same config from firebase-messaging-sw.js
const firebaseConfig = {
  apiKey: "AIzaSyDGj46tf6F8UZPprwnwgG3irtnzmsmRcqs",
  authDomain: "leftover-lunch.firebaseapp.com",
  projectId: "leftover-lunch",
  storageBucket: "leftover-lunch.firebasestorage.app",
  messagingSenderId: "589099860742",
  appId: "1:589099860742:web:67457f89df9e78d0a41487",
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