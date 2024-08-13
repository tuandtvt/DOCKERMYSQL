import axios from 'axios';

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
    }
};

export default {
    sendNotification
};
