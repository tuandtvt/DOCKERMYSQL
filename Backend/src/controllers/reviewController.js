import reviewService from "../services/reviewService";
import CustomError from '../utils/CustomError';
import ERROR_CODES from '../errorCodes';

const handleErrors = (res, error) => {
  if (error instanceof CustomError) {
    res.status(error.status || 400).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => handleErrors(res, error));
};

const addReview = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;
  const { product_id } = req.params;
  const user_id = req.user.id;

  if (!product_id || !rating || !comment) {
    return next(new CustomError(ERROR_CODES.INVALID_REQUEST));
  }
  const review = await reviewService.addReview(user_id, product_id, rating, comment);
  res.status(201).json(review);
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
