import authService from "../services/authService";
import CustomError from '../utils/CustomError';
import ERROR_CODES from '../errorCodes';

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

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // console.log('Login request data:', { email, password });
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
    const { email, newPassword } = req.body;
    const result = await authService.changePassword(email, newPassword);
    res.status(result.errCode === 0 ? 200 : 400).json(result);
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      next(new CustomError(ERROR_CODES.SERVER_ERROR));
    }
  }
};

export default {
  register,
  login,
  changePassword,
};
