import admin from './firebaseAdmin';

const sendNotification = (token, message) => {
    const payload = {
        notification: {
            title: message.title,
            body: message.body,
        },
        data: {
            additionalData: 'value',
        },
    };

    return admin.messaging().sendToDevice(token, payload)
        .then(response => {
            console.log('Successfully sent message:', JSON.stringify(response));
        })
        .catch(error => {
            console.log('Error sending message:', error);
        });
};

export default { sendNotification };
