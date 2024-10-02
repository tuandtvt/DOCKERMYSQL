require('dotenv').config();
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'test-producer',
    brokers: [process.env.KAFKA_BROKER],
});

const sendMessage = async () => {
    const producer = kafka.producer();
    await producer.connect();
    const message = {
        email: 'tuandtvt02@gmail.com',
        notification: {
            title: 'Test Order',
            body: 'Your order has been processed successfully.'
        }
    };

    await producer.send({
        topic: 'order-emails',
        messages: [{ value: JSON.stringify(message) }],
    });

    console.log('Test message sent to order-emails topic.');
    await producer.disconnect();
};

sendMessage().catch(console.error);
