import admin from '../firebaseAdmin';

const sendNotification = async (token, message) => {
    if (!token) {
        return { errCode: 1, message: 'Notification token is required' };
    }

    try {
        const notificationMessage = {
            token: token,
            notification: {
                title: message.title,
                body: message.body,
            },
        };
        const response = await admin.messaging().send(notificationMessage);
        console.log('Notification sent:', response);
        return { message: 'Notification sent successfully', response };
    } catch (error) {
        console.error('Service error:', error);
        return { errCode: 500, message: 'Failed to send notification' };
    }
};

const sendNotificationToTopic = async (topic, message) => {
    if (!topic) {
        return { errCode: 1, message: 'Topic is required' };
    }

    try {
        const notificationMessage = {
            topic: topic,
            notification: {
                title: message.title,
                body: message.body,
            },
        };
        const response = await admin.messaging().send(notificationMessage);
        console.log('Notification sent to topic:', response);
        return { message: 'Notification sent to topic successfully', response };
    } catch (error) {
        console.error('Service error:', error);
        return { errCode: 500, message: 'Failed to send notification to topic' };
    }
};

const subscribeToTopic = async (token, topic) => {
    if (!token || !topic) {
        return { errCode: 1, message: 'Token and topic are required' };
    }

    try {
        const response = await admin.messaging().subscribeToTopic(token, topic);
        console.log('Subscribed to topic:', response);
        return { message: 'Subscribed to topic successfully', response };
    } catch (error) {
        console.error('Service error:', error);
        return { errCode: 500, message: 'Failed to subscribe to topic' };
    }
};

export default {
    sendNotification,
    sendNotificationToTopic,
    subscribeToTopic,
};
