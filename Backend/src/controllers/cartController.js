import cartService from "../services/cartService";
import { asyncHandler, sendResponse } from '../utils/CustomError';

const addToCart = asyncHandler(async (req, res) => {
  const { product_id, quantity } = req.body;
  const user_id = req.user.id;

  if (!product_id || !quantity) {
    return sendResponse(res, { message: 'Product ID and quantity are required' }, 400);
  }

  const result = await cartService.addToCart(user_id, product_id, quantity);
  sendResponse(res, result);
});

const removeFromCart = asyncHandler(async (req, res) => {
  const { cartItem_id } = req.params;
  const user_id = req.user.id;

  const result = await cartService.removeFromCart(user_id, cartItem_id);
  sendResponse(res, result);
});

const getCart = asyncHandler(async (req, res) => {
  const user_id = req.user.id;
  const result = await cartService.getCart(user_id);
  sendResponse(res, result);
});

const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const { cartItem_id } = req.params;
  const { quantity } = req.body;
  const user_id = req.user.id;

  if (!quantity || quantity <= 0) {
    return sendResponse(res, { message: 'Valid quantity is required' }, 400);
  }

  const result = await cartService.updateCartItemQuantity(user_id, cartItem_id, quantity);
  sendResponse(res, result);
});

export default {
  addToCart,
  removeFromCart,
  getCart,
  updateCartItemQuantity
};
