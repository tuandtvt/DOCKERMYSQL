// Scripts for firebase and firebase messaging
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyD1rHK6SwiRsJy5R73YDc-5Spgb9OzLz6w",
    authDomain: "dockermysql.firebaseapp.com",
    projectId: "dockermysql",
    storageBucket: "dockermysql.appspot.com",
    messagingSenderId: "968089977666",
    appId: "1:968089977666:web:5fd7b20d71a70a6d07fedb",
    measurementId: "G-DGYDFE85PV"
};

// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function (payload) {
//     console.log('Received background message ', payload);

//     const notificationTitle = payload.notification.title;
//     const notificationOptions = {
//         body: payload.notification.body,
//     };

//     // eslint-disable-next-line no-restricted-globals
//     self.registration.showNotification(notificationTitle,
//         notificationOptions);
// });
