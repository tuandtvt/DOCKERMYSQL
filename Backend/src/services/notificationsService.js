import admin from '../firebaseAdmin';

const sendNotification = async (token, message) => {
    if (!token) {
        throw new Error('Notification token is required');
    }

    const notificationMessage = {
        token: token,
        notification: {
            title: message.title,
            body: message.body,
        },
    };

    try {
        const response = await admin.messaging().send(notificationMessage);
        console.log('Notification sent:', response);
        return response;
    } catch (error) {
        console.error('Error sending notification:', error);
        throw new Error('Failed to send notification');
    }
};

const sendNotificationToTopic = async (topic, message) => {
    if (!topic) {
        throw new Error('Topic is required');
    }

    const notificationMessage = {
        topic: topic,
        notification: {
            title: message.title,
            body: message.body,
        },
    };
    console.log('msjssjsjs', topic)
    try {
        const response = await admin.messaging().send(notificationMessage);
        console.log('Notification sent to topic:', response);
        return response;
    } catch (error) {
        console.error('Error sending notification to topic:', error);
        throw new Error('Failed to send notification to topic');
    }
};


const subscribeToTopic = async (token, topic) => {
    if (!token || !topic) {
        throw new Error('Token and topic are required');
    }

    try {
        const response = await admin.messaging().subscribeToTopic(token, topic);
        console.log('Subscribed to topic:', response);
        return response;
    } catch (error) {
        console.error('Error subscribing to topic:', error);
        throw new Error('Failed to subscribe to topic');
    }
};


export default {
    sendNotification,
    sendNotificationToTopic,
    subscribeToTopic,
};
