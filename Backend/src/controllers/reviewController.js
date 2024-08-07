import reviewService from "../services/reviewService";
import CustomError from '../utils/CustomError';
import ERROR_CODES from '../errorCodes';

const addReview = async (req, res, next) => {
  const { rating, comment } = req.body;
  const { product_id } = req.params;    
  const user_id = req.user.id; 

  if (!product_id || !rating) {
    return res.status(400).json({ message: 'Product ID và đánh giá là bắt buộc' });
  }

  try {
    const review = await reviewService.addReview(user_id, product_id, rating, comment);
    res.status(201).json(review);
  } catch (error) {
    console.error("Error adding review:", error);
    next(new CustomError(ERROR_CODES.SERVER_ERROR));
  }
};

const getProductReviews = async (req, res, next) => {
  const { product_id } = req.params;

  try {
    const reviews = await reviewService.getProductReviews(product_id);
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    next(new CustomError(ERROR_CODES.SERVER_ERROR));
  }
};

export default {
  addReview,
  getProductReviews
};
