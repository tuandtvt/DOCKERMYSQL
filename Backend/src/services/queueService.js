import amqp from 'amqplib';

let channel;

export const connectQueue = async () => {
    try {
        const rabbitMQConnection = await amqp.connect(`amqp://${process.env.RABBITMQ_HOST}`);
        channel = await rabbitMQConnection.createChannel();
        await channel.assertQueue('order_notifications', { durable: true });
        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
        throw error;
    }
};

export const sendMessageToQueue = async (queue, messages) => {
    if (!channel) {
        console.error("RabbitMQ channel is not initialized");
        throw new Error("RabbitMQ channel is not initialized");
    }

    const startTime = new Date().toISOString();

    messages.forEach((msg) => {
        const messageWithTimestamp = { ...msg, startTime };

        console.log(`Sending message to RabbitMQ queue: ${queue}`, messageWithTimestamp);

        channel.sendToQueue(queue, Buffer.from(JSON.stringify(messageWithTimestamp)), {
            expiration: 60000
        });
    });

    console.log(`Messages successfully sent to RabbitMQ queue: ${queue}`);

    const queueStatus = await channel.checkQueue(queue);
    console.log(`Queue "${queue}" has ${queueStatus.messageCount} messages after sending.`);
};
