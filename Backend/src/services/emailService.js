require("dotenv").config();
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
    });
    return { message: 'Email sent successfully' };
  } catch (error) {
    console.error('Service error:', error);
    if (error.responseCode) {
      return { errCode: error.responseCode, message: error.message };
    }
    return { errCode: 500, message: 'Internal Server Error' };
  }
};
export default {
  sendEmail,
};
