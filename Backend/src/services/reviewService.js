import db from "../models";
import CustomError from '../utils/CustomError';
import ERROR_CODES from '../errorCodes';

const handleErrors = (error) => {
  if (error instanceof CustomError) {
    throw error;
  }
  console.error('Service error:', error);
  throw new CustomError(ERROR_CODES.SERVER_ERROR);
};

const asyncHandler = (fn) => async (...args) => {
  try {
    return await fn(...args);
  } catch (error) {
    handleErrors(error);
  }
};

const addReview = asyncHandler(async (user_id, product_id, rating, comment) => {
  const existingReview = await db.Review.findOne({
    where: {
      user_id,
      product_id,
      status: 1
    }
  });

  if (existingReview) {
    throw new CustomError(ERROR_CODES.REVIEW_ALREADY_SUBMITTED);
  }
  const order = await db.Order.findOne({
    include: [{
      model: db.Cart,
      as: 'cart',
      include: [{
        model: db.CartItem,
        as: 'CartItems',
        where: { product_id }
      }]
    }],
    where: {
      user_id,
      order_status: 'delivered'
    }
  });

  if (!order) {
    throw new CustomError(ERROR_CODES.INVALID_REQUEST, 'Bạn chưa mua hoặc chưa nhận sản phẩm này');
  }

  const review = await db.Review.create({
    user_id,
    product_id,
    rating,
    comment,
    status: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  return review;
});

const getProductReviews = asyncHandler(async (product_id) => {
  const reviews = await db.Review.findAll({
    where: { product_id },
    include: [{ model: db.User, as: 'user', attributes: ['id', 'username'] }]
  });
  return reviews;
});

export default {
  addReview,
  getProductReviews
};
