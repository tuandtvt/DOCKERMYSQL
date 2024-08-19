import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models';
import CustomError from '../utils/CustomError';
import ERROR_CODES from '../errorCodes';
import emailService from './emailService';

const generateToken = (payload, expiresIn = '1d') =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

const handleErrors = (error) => {
  if (error instanceof CustomError) {
    throw error;
  }
  console.error('Service error:', error);
  throw new CustomError(ERROR_CODES.SERVER_ERROR);
};

const asyncHandler = (fn) => async (...args) => {
  try {
    return await fn(...args);
  } catch (error) {
    handleErrors(error);
  }
};

const register = asyncHandler(async (username, email, password, address) => {
  if (await db.User.findOne({ where: { email } })) {
    throw new CustomError(ERROR_CODES.EMAIL_ALREADY_EXISTS);
  }

  const hashedPassword = await bcrypt.hash(password, 8);
  const newUser = await db.User.create({
    username,
    email,
    password: hashedPassword,
    address,
    status: false
  });

  const token = generateToken({ id: newUser.id });
  const verifyLink = `${process.env.FRONTEND_URL}/api/verify/${token}`;

  await emailService.sendEmail(
    email,
    'Xác thực tài khoản',
    `Xin chào ${username},\n\nVui lòng xác minh tài khoản của bạn bằng cách nhấp vào liên kết: ${verifyLink}\n\nTrân trọng,\nTuan`
  );

  return {
    errCode: 0,
    message: 'User registered successfully. Please check your email to verify your account.',
    user: newUser,
  };
});

const verifyAccount = asyncHandler(async (token) => {
  const { id } = jwt.verify(token, process.env.JWT_SECRET);
  const user = await db.User.findByPk(id);

  if (!user) throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
  if (user.status) throw new CustomError(ERROR_CODES.ACCOUNT_ALREADY_VERIFIED);

  user.status = true;
  await user.save();

  return { errCode: 0, message: 'Account verified successfully' };
});

const login = asyncHandler(async (email, password) => {
  const user = await db.User.findOne({ where: { email } });
  if (!user) throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
  if (!user.status) throw new CustomError(ERROR_CODES.ACCOUNT_NOT_VERIFIED);

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new CustomError(ERROR_CODES.INVALID_PASSWORD);

  const token = generateToken({ id: user.id, email: user.email });
  return { errCode: 0, message: 'Login successful', token };
});

const changePassword = asyncHandler(async (email, currentPassword, newPassword) => {
  const user = await db.User.findOne({ where: { email } });
  if (!user) throw new CustomError(ERROR_CODES.USER_NOT_FOUND);

  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isCurrentPasswordValid) throw new CustomError(ERROR_CODES.INVALID_PASSWORD);

  const hashedPassword = await bcrypt.hash(newPassword, 8);
  await user.update({ password: hashedPassword });

  await emailService.sendEmail(
    email,
    'Thay đổi mật khẩu',
    `Xin chào ${user.username},\n\nMật khẩu của bạn đã được thay đổi.\n\nNếu có vấn đề gì về mật khẩu, vui lòng liên hệ để được hỗ trợ\n\nTrân trọng,\nTuấn`
  );

  return { errCode: 0, message: 'Password changed successfully' };
});

const forgotPassword = asyncHandler(async (email) => {
  const user = await db.User.findOne({ where: { email } });
  if (!user) throw new CustomError(ERROR_CODES.USER_NOT_FOUND);

  const token = generateToken({ id: user.id });
  await emailService.sendEmail(
    email,
    'Lấy lại mật khẩu',
    `Xin chào,\n\nĐể lấy lại mật khẩu, bạn vui lòng nhấn vào link: ${process.env.REACT_URL}/api/v1/reset-password/${token}\n\nTrân trọng,\nTuấn`
  );

  return { errCode: 0, message: 'Password reset email sent successfully.' };
});

const resetPassword = asyncHandler(async (token, newPassword) => {
  const { id } = jwt.verify(token, process.env.JWT_SECRET);
  const user = await db.User.findByPk(id);
  if (!user) throw new CustomError(ERROR_CODES.USER_NOT_FOUND);

  const hashedPassword = await bcrypt.hash(newPassword, 8);
  await user.update({ password: hashedPassword });

  return { errCode: 0, message: 'Password reset successfully.' };
});

const updateNotificationToken = asyncHandler(async (user_id, notificationToken) => {
  const user = await db.User.findByPk(user_id);
  if (!user) {
    throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
  }
  user.notificationToken = notificationToken;
  await user.save();

  return { message: 'Notification token đã được cập nhật thành công' };
});

export default {
  register,
  verifyAccount,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
  updateNotificationToken
};
