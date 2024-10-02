import db from "../models";
import ERROR_CODES from '../errorCodes';

const addReview = async (user_id, product_id, rating, comment, cart_item_id) => {
  const existingReview = await db.Review.findOne({
    where: {
      user_id,
      product_id,
      cart_item_id,
      status: 1
    }
  });
  console.log('existingReviewwwwwwwwwwww', existingReview)
  if (existingReview) {
    return { message: ERROR_CODES.REVIEW_ALREADY_SUBMITTED };
  }

  const order = await db.Order.findOne({
    include: [{
      model: db.Cart,
      as: 'cart',
      include: [{
        model: db.CartItem,
        as: 'CartItems',
        where: { product_id, }
      }]
    }],
    where: {
      user_id,
      order_status: 3,
    }
  });

  if (!order) {
    return { message: ERROR_CODES.ORDER_NOT_FOUND };
  }

  const review = await db.Review.create({
    user_id,
    product_id,
    rating,
    comment,
    status: 1,
    cart_item_id,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  return review;
};

const getProductReviews = async (product_id) => {
  const reviews = await db.Review.findAll({
    where: { product_id },
    include: [{ model: db.User, as: 'user', attributes: ['id', 'username'] }]
  });
  return reviews;
};

export default {
  addReview,
  getProductReviews
};
