class CustomError extends Error {
  constructor({ code, message, statusCode }) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

export const handleErrors = (res, error) => {
  if (error instanceof CustomError) {
    res.status(error.statusCode || 400).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => handleErrors(res, error));
};

export const sendResponse = (res, result) => {
  const status = result.errCode === 0 ? 200 : 400;
  res.status(status).json(result);
};

export default CustomError;
