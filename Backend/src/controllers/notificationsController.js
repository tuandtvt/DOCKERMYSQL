// import notificationsService from '../services/notificationsService';

// const sendNotification = async (req, res) => {
//     const { token, title, body } = req.body;

//     try {
//         const message = { title, body };
//         const response = await notificationsService.sendNotification(token, message);
//         return res.status(200).json({ message: 'Notification sent', data: response });
//     } catch (error) {
//         console.error('Error in sendNotification controller:', error.message);
//         return res.status(500).json({ error: 'Failed to send notification' });
//     }
// };

// const sendNotificationToTopic = async (req, res) => {
//     const { topic, title, body } = req.body;

//     try {
//         const message = { title, body };
//         const response = await notificationsService.sendNotificationToTopic(topic, message);
//         return res.status(200).json({ message: 'Notification sent to topic', data: response });
//     } catch (error) {
//         console.error('Error in sendNotificationToTopic controller:', error.message);
//         return res.status(500).json({ error: 'Failed to send notification to topic' });
//     }
// };

// const subscribeToTopic = async (req, res) => {
//     const { token, topic } = req.body;

//     try {
//         const response = await notificationsService.subscribeToTopic(token, topic);
//         return res.status(200).json({ message: `Subscribed to topic ${topic}`, data: response });
//     } catch (error) {
//         console.error('Error in subscribeToTopic controller:', error.message);
//         return res.status(500).json({ error: 'Failed to subscribe to topic' });
//     }
// };

// export default {
//     sendNotification,
//     sendNotificationToTopic,
//     subscribeToTopic,
// };
