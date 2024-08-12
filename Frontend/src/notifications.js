import { getToken, onMessage } from "firebase/messaging";
import { messaging } from './firebase';
import axios from 'axios';


const requestPermission = async (userId) => {
    try {
        const token = await getToken(messaging, { vapidKey: 'BIfCh91B51XR7eeHX5MyRGVy7HpQOlA0GWkSYJsWuINuHNckNGGC6H8OD4LjgYOj2sM0yN9WYw9QYUnb80mH47c' });
        if (token) {
            console.log("Token received: ", token);

            await axios.post('http://localhost:8080/api/v1/users/updateNotificationToken', {
                user_id: userId,
                token: token,
            });
        } else {
            console.log('No registration token available.');
        }
    } catch (err) {
        console.error("Unable to get permission to notify.", err);
    }
};



const receiveMessage = () => {
    onMessage(messaging, (payload) => {
        console.log('Message received. ', payload);
        alert(`${payload.notification.title}: ${payload.notification.body}`);
    });
};

export { requestPermission, receiveMessage };
