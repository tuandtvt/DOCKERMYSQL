import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models';
import emailService from './emailService';
import ERROR_CODES from '../errorCodes';

const generateToken = (payload, expiresIn = '1d') =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

aaaaaaaaaa

const register = async (username, email, password, address) => {
  console.log("Registering user:", username, email);

  try {
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      console.log("Email already exists:", email);
      return { message: ERROR_CODES.EMAIL_ALREADY_EXISTS };
    }

    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 8);

    console.log("Creating new user...");
    const newUser = await db.User.create({
      username,
      email,
      password: hashedPassword,
      address,
      status: false
    });

    console.log("User created:", newUser);
    const token = generateToken({ id: newUser.id });
    const verifyLink = `${process.env.FRONTEND_URL}/api/verify/${token}`;
    console.log("Generated verify link:", verifyLink);

    console.log("Sending verification email to:", email);
    await emailService.sendEmail(
      email,
      'Xác thực tài khoản',
      `Xin chào ${username},\n\nVui lòng xác minh tài khoản của bạn bằng cách nhấp vào liên kết: ${verifyLink}\n\nTrân trọng,\nTuan`
    );

    return {
      message: 'User registered successfully. Please check your email to verify your account.',
      user: newUser,
    };
  } catch (error) {
    console.error("Error in authService register:", error);
    throw new Error("Error registering user");
  }
};


const verifyAccount = async (token) => {
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.User.findByPk(id);

    if (!user) return { message: ERROR_CODES.USER_NOT_FOUND };
    if (user.status) return { message: ERROR_CODES.USER_STATUS_ALREADY_VERIFIED };

    user.status = true;
    await user.save();

    return { message: 'Account verified successfully' };
  } catch (error) {
    return { message: ERROR_CODES.INVALID_OR_EXPIRED_TOKEN };
  }
};

const login = async (email, password) => {
  const user = await db.User.findOne({ where: { email } });
  if (!user) return { message: ERROR_CODES.USER_NOT_FOUND };
  if (!user.status) return { message: ERROR_CODES.ACCOUNT_NOT_VERIFIED };

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return { message: ERROR_CODES.INVALID_PASSWORD };

  const token = generateToken({ id: user.id, email: user.email });
  return { message: 'Login successful', token };
};

const changePassword = async (email, currentPassword, newPassword) => {
  const user = await db.User.findOne({ where: { email } });
  if (!user) return { message: ERROR_CODES.USER_NOT_FOUND };

  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isCurrentPasswordValid) return { message: ERROR_CODES.INVALID_CURRENT_PASSWORD };

  const hashedPassword = await bcrypt.hash(newPassword, 8);
  await user.update({ password: hashedPassword });

  await emailService.sendEmail(
    email,
    'Thay đổi mật khẩu',
    `Xin chào ${user.username},\n\nMật khẩu của bạn đã được thay đổi.\n\nNếu có vấn đề gì về mật khẩu, vui lòng liên hệ để được hỗ trợ\n\nTrân trọng,\nTuấn`
  );

  return { message: 'Password changed successfully' };
};

const forgotPassword = async (email) => {
  const user = await db.User.findOne({ where: { email } });
  if (!user) return { message: ERROR_CODES.USER_NOT_FOUND };

  const token = generateToken({ id: user.id });
  await emailService.sendEmail(
    email,
    'Lấy lại mật khẩu',
    `Xin chào,\n\nĐể lấy lại mật khẩu, bạn vui lòng nhấn vào link: ${process.env.REACT_URL}/api/v1/reset-password/${token}\n\nThanks,\nTuấn`
  );

  return { message: 'Password reset email sent successfully.' };
};

const resetPassword = async (token, newPassword) => {
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.User.findByPk(id);
    if (!user) return { message: ERROR_CODES.USER_NOT_FOUND };

    const hashedPassword = await bcrypt.hash(newPassword, 8);
    await user.update({ password: hashedPassword });

    return { message: 'Password reset successfully.' };
  } catch (error) {
    return { message: ERROR_CODES.INVALID_OR_EXPIRED_TOKEN };
  }
};

const updateNotificationToken = async (user_id, notificationToken) => {
  const user = await db.User.findByPk(user_id);
  if (!user) return { message: ERROR_CODES.USER_NOT_FOUND };

  user.notificationToken = notificationToken;
  await user.save();

  return { message: 'Notification token đã được cập nhật thành công' };
};

export default {
  register,
  verifyAccount,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
  updateNotificationToken
};
