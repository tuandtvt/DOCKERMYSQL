import admin from '../firebaseAdmin';
import CustomError from '../utils/CustomError';
import ERROR_CODES from '../errorCodes';

const handleErrors = (error) => {
    if (error instanceof CustomError) {
        throw error;
    }
    console.error('Service error:', error);
    throw new CustomError(ERROR_CODES.SERVER_ERROR);
};

const asyncHandler = (fn) => async (...args) => {
    try {
        return await fn(...args);
    } catch (error) {
        handleErrors(error);
    }
};

const sendNotification = asyncHandler(async (token, message) => {
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
    const response = await admin.messaging().send(notificationMessage);
    console.log('Notification sent:', response);
    return response;
});

const sendNotificationToTopic = asyncHandler(async (topic, message) => {
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
    const response = await admin.messaging().send(notificationMessage);
    console.log('Notification sent to topic:', response);
    return response;
});

const subscribeToTopic = asyncHandler(async (token, topic) => {
    if (!token || !topic) {
        throw new Error('Token and topic are required');
    }
    const response = await admin.messaging().subscribeToTopic(token, topic);
    console.log('Subscribed to topic:', response);
    return response;
});


export default {
    sendNotification,
    sendNotificationToTopic,
    subscribeToTopic,
};