import authService from "../services/authService";
import { asyncHandler, sendResponse } from '../utils/CustomError';

const register = asyncHandler(async (req, res) => {
  const { username, email, password, address } = req.body;
  const result = await authService.register(username, email, password, address);
  sendResponse(res, result);
});

const verifyAccount = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const result = await authService.verifyAccount(token);
  sendResponse(res, result);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  sendResponse(res, result);
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { email } = req.user;
  const result = await authService.changePassword(email, currentPassword, newPassword);
  sendResponse(res, result);
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await authService.forgotPassword(email);
  sendResponse(res, result);
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  const result = await authService.resetPassword(token, newPassword);
  sendResponse(res, result);
});

const updateNotificationToken = asyncHandler(async (req, res) => {
  const { user_id, notificationToken } = req.body;

  if (!user_id || !notificationToken) {
    return res.status(400).json({ message: 'User ID và notification token là bắt buộc' });
  }

  const result = await authService.updateNotificationToken(user_id, notificationToken);
  sendResponse(res, result);
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
