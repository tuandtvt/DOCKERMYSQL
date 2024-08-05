import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models';
import CustomError from '../utils/CustomError';
import ERROR_CODES from '../errorCodes';

const register = async (username, email, password, address) => {
  console.log('hihi', username, email, password, address)
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

export default {
  register,
  login,
};
