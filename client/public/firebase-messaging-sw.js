importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDGj46tf6F8UZPprwnwgG3irtnzmsmRcqs",
  authDomain: "leftover-lunch.firebaseapp.com",
  projectId: "leftover-lunch",
  storageBucket: "leftover-lunch.firebasestorage.app",
  messagingSenderId: "589099860742",
  appId: "1:589099860742:web:67457f89df9e78d0a41487",
  measurementId: "G-KQNC6XQXLW"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background Message ', payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/icon-192.png'
  });
});










// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDGj46tf6F8UZPprwnwgG3irtnzmsmRcqs",
//   authDomain: "leftover-lunch.firebaseapp.com",
//   projectId: "leftover-lunch",
//   storageBucket: "leftover-lunch.firebasestorage.app",
//   messagingSenderId: "589099860742",
//   appId: "1:589099860742:web:67457f89df9e78d0a41487",
//   measurementId: "G-KQNC6XQXLW"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
