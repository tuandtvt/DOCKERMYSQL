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
      address
    });

    await emailService.sendEmail(
      email,
      'Welcome to Our Service',
      `Hello ${username},\n\nThank you for registering. We are excited to have you on board!\n\nBest regards,\nTeam`
    );

    return {
      errCode: 0,
      message: 'User registered successfully',
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


const login = async (email, password) => {
  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new CustomError(ERROR_CODES.INVALID_PASSWORD);
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
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

const changePassword = async (email, newPassword) => {
  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 8);
    await user.update({ password: hashedPassword });

    await emailService.sendEmail(
      email,
      'Password Changed',
      `Hello ${user.username},\n\nYour password has been successfully changed.\n\nIf you did not make this change, please contact our support immediately.\n\nBest regards,\nTeam`
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


export default {
  register,
  login,
  changePassword,
};
