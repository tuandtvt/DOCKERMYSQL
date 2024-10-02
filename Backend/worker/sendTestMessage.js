require('dotenv').config();
const amqp = require('amqplib');

const sendTestMessage = async () => {
    try {
        // Kết nối tới RabbitMQ
        const connection = await amqp.connect(`amqp://${process.env.RABBITMQ_HOST}`);
        const channel = await connection.createChannel();

        // Đảm bảo queue 'order_notifications' tồn tại
        await channel.assertQueue('order_notifications', { durable: true });

        // Gửi thử một message vào queue
        const testMessage = { message: 'test message' };
        channel.sendToQueue('order_notifications', Buffer.from(JSON.stringify(testMessage)));
        console.log('Test message sent to queue "order_notifications"');

        // Đóng kết nối sau khi gửi message
        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

// Gọi hàm để gửi message
sendTestMessage();
