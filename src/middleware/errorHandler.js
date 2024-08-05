import CustomError from '../utils/CustomError';

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      error: err.code,
      message: err.message,
    });
  }

  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'SERVER_ERROR',
    message: 'Internal server error',
  });
};

export default errorHandler;
