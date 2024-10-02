require('dotenv').config();
const amqp = require('amqplib');
const nodemailer = require('nodemailer');

const sleepPromise = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const consumeOrderNotifications = async () => {
    const connection = await amqp.connect(`amqp://${process.env.RABBITMQ_HOST}`);
    const channel = await connection.createChannel();

    await channel.prefetch(1);

    await channel.assertQueue('order_notifications', { durable: true });

    channel.consume('order_notifications', async (msg) => {
        if (msg !== null) {
            console.log(`Received message from queue: ${msg.content.toString()}`);
            const message = JSON.parse(msg.content.toString());

            const { email, notification, startTime } = message;

            if (email && notification) {
                const { title, body } = notification;
                const startProcessingTime = new Date(startTime);
                const endProcessingTime = new Date();
                const totalTime = endProcessingTime - startProcessingTime;

                console.log(`Sending email to: ${email}, Total time: ${totalTime}ms`);

                await sendEmail(email, title, body);

                await sleepPromise(10000);
            }

            channel.ack(msg);
        }
    });
};

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to,
        subject,
        text
    };

    const startTime = new Date();

    try {
        const info = await transporter.sendMail(mailOptions);
        const endTime = new Date();
        const timeToken = endTime - startTime;

        console.log(`Email sent: ${info.response}, Time: ${timeToken}ms`);
    } catch (error) {
        console.error(error);
    }
};

consumeOrderNotifications().catch(console.error);
