import authService from "../services/authService";
import { asyncHandler, sendResponse } from '../utils/CustomError';

const register = asyncHandler(async (req, res) => {
  console.log("Request body:", req.body);
  const { username, email, password, address } = req.body;

  try {
    const result = await authService.register(username, email, password, address);
    console.log("Register result:", result);
    sendResponse(res, result);
  } catch (error) {
    console.error("Error in authController register:", error);
    sendResponse(res, { message: "Internal Server Error" }, 500);
  }
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
