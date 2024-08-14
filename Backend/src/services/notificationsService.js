import axios from 'axios';
import admin from '../firebaseAdmin';



const sendNotification = async (token, message) => {
    console.log('>>> check token', token)
    try {
        const response = await axios.post('http://localhost:5000/send-noti', {
            title: message.title,
            content: message.body,
            token: token
        });

        const { data } = response;

        console.log('>> check response title:', message.title);
        console.log('>> check response content:', message.body);
        console.log('>> check response token:', token);

        console.log('Notification response:', response.data);
    } catch (error) {
        console.error('Error sending notification:', error);
        throw error;
    };
};

const sendNotificationToTopic = async (topic, message) => {
    try {
        const response = await admin.messaging().send({
            notification: {
                title: message.title,
                body: message.body,
            },
            topic: topic,
        });

        console.log('Notification sent to topic:', response);
    } catch (error) {
        console.error('Error sending notification to topic:', error);
        throw error;
    }
};

const subscribeToTopic = async (token, topic) => {
    try {
        const response = await axios.post('http://localhost:5000/subscribe-topic', {
            token: token,
            topic: topic
        });

        console.log('Subscription response:', response.data);
    } catch (error) {
        console.error('Error subscribing to topic:', error);
        throw error;
    }
};


export default {
    sendNotification,
    sendNotificationToTopic,
    subscribeToTopic
};


