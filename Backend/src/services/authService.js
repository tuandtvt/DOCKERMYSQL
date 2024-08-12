import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models';
import CustomError from '../utils/CustomError';
import ERROR_CODES from '../errorCodes';
import emailService from './emailService';


const register = async (username, email, password, address) => {
  try {
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
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

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

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
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    console.error('Error registering user:', error);
    throw new CustomError(ERROR_CODES.SERVER_ERROR);
  }
};

const verifyAccount = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.User.findByPk(decoded.id);

    if (!user) {
      throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
    }

    if (user.status) {
      throw new CustomError(ERROR_CODES.ACCOUNT_ALREADY_VERIFIED);
    }

    user.status = true;
    await user.save();

    return {
      errCode: 0,
      message: 'Account verified successfully',
    };
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    console.error('Error verifying account:', error);
    throw new CustomError(ERROR_CODES.SERVER_ERROR);
  }
};

const login = async (email, password) => {
  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
    }

    if (!user.status) {
      throw new CustomError(ERROR_CODES.ACCOUNT_NOT_VERIFIED);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new CustomError(ERROR_CODES.INVALID_PASSWORD);
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    return {
      errCode: 0,
      message: 'Login successful',
      token,
    };
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    console.error('Error logging in:', error);
    throw new CustomError(ERROR_CODES.SERVER_ERROR);
  }
};

const changePassword = async (email, currentPassword, newPassword) => {
  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new CustomError(ERROR_CODES.INVALID_PASSWORD);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 8);
    await user.update({ password: hashedPassword });

    await emailService.sendEmail(
      email,
      'Thay đổi mật khẩu',
      `Xin chào ${user.username},\n\nMật khẩu của bạn đã được thay đổi.\n\nNếu có vấn đề gì về mật khẩu, vui lòng liên hệ để được hỗ trợ\n\nTrân trọng,\nTuấn`
    );

    return {
      errCode: 0,
      message: 'Password changed successfully',
    };
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    console.error('Error changing password:', error);
    throw new CustomError(ERROR_CODES.SERVER_ERROR);
  }
};

const forgotPassword = async (email) => {
  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    await emailService.sendEmail(
      email,
      'Lấy lại mật khẩu Password',
      `Xin chào,\n\nĐể lấy lại mật khẩu, bạn vui lòng nhấn vào link: ${process.env.REACT_URL}/api/v1/reset-password/${token}\n\nTrân trọng,\nTuấn`
    );

    return {
      errCode: 0,
      message: 'Password reset email sent successfully.',
    };
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    console.error('Error in forgot password:', error);
    throw new CustomError(ERROR_CODES.SERVER_ERROR);
  }
};

const resetPassword = async (token, newPassword) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.User.findByPk(decoded.id);

    if (!user) {
      throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 8);
    await user.update({ password: hashedPassword });

    return {
      errCode: 0,
      message: 'Password reset successfully.',
    };
  } catch (error) {
    console.error('Error resetting password:', error);
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(ERROR_CODES.SERVER_ERROR);
  }
};


export default {
  register,
  verifyAccount,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
};
