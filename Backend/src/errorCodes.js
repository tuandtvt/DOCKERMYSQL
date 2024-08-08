const ERROR_CODES = {
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: 'User not found',
    statusCode: 404
  },
  INVALID_REQUEST: {
    code: 'INVALID_REQUEST',
    message: 'Invalid request parameters',
    statusCode: 400
  },
  SERVER_ERROR: {
    code: 'SERVER_ERROR',
    message: 'Internal server error',
    statusCode: 500
  },
  AUTHENTICATION_ERROR: {
    code: 'AUTHENTICATION_ERROR',
    message: 'Authentication failed',
    statusCode: 401
  },
  TOKEN_ERROR: {
    code: 'TOKEN_ERROR',
    message: 'Invalid token',
    statusCode: 403
  },
  INSUFFICIENT_STOCK: {
    code: 'INSUFFICIENT_STOCK',
    message: 'Insufficient stock',
    statusCode: 400
  },
  EMAIL_ALREADY_EXISTS: {
    code: 'EMAIL_ALREADY_EXISTS',
    message: 'Email already exists',
    statusCode: 400
  },
  INVALID_PASSWORD: {
    code: 'INVALID_PASSWORD',
    message: 'Invalid password',
    statusCode: 400
  },
  PRODUCT_NOT_FOUND: {
    code: 'PRODUCT_NOT_FOUND',
    message: 'Product not found',
    statusCode: 404
  },
  ACCOUNT_NOT_VERIFIED: {
    code: 'ACCOUNT_NOT_VERIFIED',
    message: 'Account not verified',
    statusCode: 403
  },
  ACCOUNT_ALREADY_VERIFIED: {
    code: 'ACCOUNT_ALREADY_VERIFIED',
    message: 'Account already verified',
    statusCode: 400
  }
};

export default ERROR_CODES;
