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
  REVIEW_ALREADY_SUBMITTED: {
    code: 'REVIEW_ALREADY_SUBMITTED',
    message: 'You have rated this product and cannot change it',
    statusCode: 400
  },
  CART_NOT_FOUND: {
    code: 'CART_NOT_FOUND',
    message: 'Cart not found',
    statusCode: 400
  },
  EMAIL_NOT_FOUND: {
    code: 'EMAIL_NOT_FOUND',
    message: 'Email not found',
    statusCode: 400
  },
  PERMISION_NOT_FOUND: {
    code: 'PERMISION_NOT_FOUND',
    message: 'Permision not found',
    statusCode: 400
  },
  PERMISION_ALREADY_ASSIGNED: {
    code: 'PERMISION_ALREADY_ASSIGNED',
    message: 'Permision already assigned',
    statusCode: 400
  },
  SHOP_NOT_FOUND: {
    code: 'SHOP_NOT_FOUND',
    message: 'Shop not found',
    statusCode: 400
  },
  INVALID_STATUS_VALUE: {
    code: 'INVALID_STATUS_VALUE',
    message: 'Invalid status value',
    statusCode: 400
  },
  ROLE_NOT_FOUND: {
    code: 'ROLE_NOT_FOUND',
    message: 'Role not found',
    statusCode: 400
  },
  ROLE_ALREADY_ASSIGNED: {
    code: 'ROLE_ALREADY_ASSIGNED',
    message: 'Role already assigned',
    statusCode: 400
  },
  OLD_ORDER_NOT_FOUND: {
    code: 'OLD_ORDER_NOT_FOUND',
    message: 'Old order not found',
    statusCode: 400
  },
  PERMISION_NAME_REQUIRED: {
    code: 'PERMISION_NAME_REQUIRED',
    message: 'Permision name required',
    statusCode: 400
  },
  ROLE_NAME_REQUIRED: {
    code: 'ROLE_NAME_REQUIRED',
    message: 'Role name required',
    statusCode: 400
  },
  PERMISION_CREATION_FAILED: {
    code: 'PERMISION_CREATION_FAILED',
    message: 'Permision creation failed',
    statusCode: 400
  },
  PRODUCT_CREATION_FAILED: {
    code: 'PRODUCT_CREATION_FAILED',
    message: 'Product creation failed',
    statusCode: 400
  },
  PRODUCT_FETCH_FAILED: {
    code: 'PRODUCT_FETCH_FAILED',
    message: 'Product fetch failed',
    statusCode: 400
  },
  PRODUCT_PRICE_UPDATE_FAILED: {
    code: 'PRODUCT_PRICE_UPDATE_FAILED',
    message: 'Product price update failed',
    statusCode: 400
  },
  ROLE_PERMISION_CREATION_FAILED: {
    code: 'ROLE_PERMISION_CREATION_FAILED',
    message: 'Role permision creation failed',
    statusCode: 400
  },
  INVALID_STATUS_TRANSITION: {
    code: 'INVALID_STATUS_TRANSITION',
    message: 'Invalid status transition',
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
  ORDER_NOT_FOUND: {
    code: 'ORDER_NOT_FOUND',
    message: 'Order not found',
    statusCode: 404
  },
  QUANTITY_EXCEEDS_STOCK: {
    code: 'QUANTITY_EXCEEDS_STOCK',
    message: 'Quantity exceeds stock',
    statusCode: 404
  },
  CART_ITEM_NOT_FOUND: {
    code: 'CART_ITEM_NOT_FOUND',
    message: 'Cart item not found',
    statusCode: 404
  },
  PERMISSION_NAME_REQUIRED: {
    code: 'PERMISSION_NAME_REQUIRED',
    message: 'Permission name is required',
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
