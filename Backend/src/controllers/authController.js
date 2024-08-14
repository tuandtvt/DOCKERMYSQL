import authService from "../services/authService";
import CustomError from '../utils/CustomError';
import ERROR_CODES from '../errorCodes';
import db from "../models";

const register = async (req, res, next) => {
  try {
    const { username, email, password, address } = req.body;
    const result = await authService.register(username, email, password, address);
    res.status(result.errCode === 0 ? 200 : 400).json(result);
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      next(new CustomError(ERROR_CODES.SERVER_ERROR));
    }
  }
};


const verifyAccount = async (req, res, next) => {
  try {
    const { token } = req.params;
    const result = await authService.verifyAccount(token);
    res.status(result.errCode === 0 ? 200 : 400).json(result);
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      next(new CustomError(ERROR_CODES.SERVER_ERROR));
    }
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(result.errCode === 0 ? 200 : 400).json(result);
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      next(new CustomError(ERROR_CODES.SERVER_ERROR));
    }
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { email } = req.user;
    const result = await authService.changePassword(email, currentPassword, newPassword);
    res.status(result.errCode === 0 ? 200 : 400).json(result);
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      next(new CustomError(ERROR_CODES.SERVER_ERROR));
    }
  }
};



const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    res.status(result.errCode === 0 ? 200 : 400).json(result);
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      next(new CustomError(ERROR_CODES.SERVER_ERROR));
    }
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const result = await authService.resetPassword(token, newPassword);
    res.status(result.errCode === 0 ? 200 : 400).json(result);
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.status || 400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

const updateNotificationToken = async (req, res) => {
  const { user_id, notificationToken } = req.body;

  if (!user_id || !notificationToken) {
    return res.status(400).json({ message: 'User ID và notification token là bắt buộc' });
  }

  try {
    const user = await db.User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User không tồn tại' });
    }

    user.notificationToken = notificationToken;
    await user.save();

    return res.status(200).json({ message: 'Notification token đã được cập nhật thành công' });
  } catch (error) {
    console.error('Error updating notification token:', error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật notification token' });
  }
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
