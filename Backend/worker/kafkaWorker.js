require('dotenv').config();
console.log("Kafka Broker:", process.env.KAFKA_BROKER);
const { Kafka } = require('kafkajs');
const nodemailer = require('nodemailer');

const kafka = new Kafka({
    clientId: 'email-service',
    brokers: [process.env.KAFKA_BROKER]
});

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const createTopicIfNotExists = async (topic) => {
    const admin = kafka.admin();
    await admin.connect();
    const topics = await admin.listTopics();
    console.log(`Existing topics: ${topics.join(", ")}`);

    if (!topics.includes(topic)) {
        console.log(`Topic ${topic} does not exist. Creating...`);
        await admin.createTopics({
            topics: [
                {
                    topic,
                    numPartitions: 1,
                    replicationFactor: 1,
                },
            ],
        });
        console.log(`Topic ${topic} created.`);
    } else {
        console.log(`Topic ${topic} already exists.`);
    }

    await admin.disconnect();
};

const consumeOrderEmails = async () => {
    const topic = 'order-emails';

    await createTopicIfNotExists(topic);

    const consumer = kafka.consumer({ groupId: 'email-group' });

    await consumer.connect();
    console.log("Connected to Kafka consumer.");

    await consumer.subscribe({ topic, fromBeginning: true });
    console.log(`Subscribed to topic: ${topic}`);

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log("Received message from Kafka:", message.value.toString());

            const orderNotification = JSON.parse(message.value.toString());
            console.log("Parsed orderNotification:", orderNotification);

            const mailOptions = {
                from: process.env.SMTP_USER,
                to: orderNotification.email,
                subject: orderNotification.notification.title,
                text: orderNotification.notification.body,
            };

            console.log(`Preparing to send email to: ${orderNotification.email} with subject: ${orderNotification.notification.title}`);

            try {
                const info = await transporter.sendMail(mailOptions);
                console.log('Email sent successfully to:', orderNotification.email, 'Info:', info);
            } catch (error) {
                console.error('Error sending email:', error);
                console.error(`Failed to send email to: ${orderNotification.email}`);
            }
        }
    });
};

consumeOrderEmails().catch((error) => {
    console.error('Error in consumer:', error);
});
