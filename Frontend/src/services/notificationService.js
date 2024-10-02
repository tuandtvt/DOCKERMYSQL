import firebase from 'firebase/app';
import 'firebase/messaging';
import axios from 'axios';

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

export const getNotificationToken = async (userId) => {
    try {
        const currentToken = await messaging.getToken({ vapidKey: 'YOUR_PUBLIC_VAPID_KEY' });
        if (currentToken) {
            console.log('Notification Token:', currentToken);

            await axios.post('http://localhost:8080/api/update-notification-token', {
                user_id: userId,
                notificationToken: currentToken,
            });
        } else {
            console.log('No registration token available. Request permission to generate one.');
        }
    } catch (err) {
        console.error('An error occurred while retrieving token. ', err);
    }
};