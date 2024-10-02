import reviewService from "../services/reviewService";
import ERROR_CODES from '../errorCodes';
import { asyncHandler } from "../utils/CustomError";


const addReview = asyncHandler(async (req, res, next) => {
  const { rating, comment, cart_item_id } = req.body;
  const { product_id } = req.params;
  const user_id = req.user.id;

  if (!product_id || !rating || !comment) {
    return res.status(400).json({ message: ERROR_CODES.INVALID_REQUEST });
  }

  const result = await reviewService.addReview(user_id, product_id, rating, comment, cart_item_id);



  res.status(201).json(result);
});

const getProductReviews = asyncHandler(async (req, res, next) => {
  const { product_id } = req.params;

  const reviews = await reviewService.getProductReviews(product_id);
  res.status(200).json(reviews);
});

export default {
  addReview,
  getProductReviews
};
