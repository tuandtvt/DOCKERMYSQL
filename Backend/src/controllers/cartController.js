import cartService from "../services/cartService";
import CustomError from '../utils/CustomError';

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

const addToCart = asyncHandler(async (req, res) => {
  const { product_id, quantity } = req.body;
  const user_id = req.user.id;

  if (!product_id || !quantity) {
    return res.status(400).json({ message: 'Product ID and quantity are required' });
  }

  await cartService.addToCart(user_id, product_id, quantity);
  res.status(200).json({ message: 'Product added to cart' });
});

const removeFromCart = asyncHandler(async (req, res) => {
  const { cartItem_id } = req.params;
  const user_id = req.user.id;

  await cartService.removeFromCart(user_id, cartItem_id);
  res.status(200).json({ message: 'Cart item removed' });
});

const getCart = asyncHandler(async (req, res) => {
  const user_id = req.user.id;
  const cartItems = await cartService.getCart(user_id);
  res.status(200).json(cartItems);
});

const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const { cartItem_id } = req.params;
  const { quantity } = req.body;
  const user_id = req.user.id;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Valid quantity is required' });
  }

  await cartService.updateCartItemQuantity(user_id, cartItem_id, quantity);
  res.status(200).json({ message: 'Cart item quantity updated' });
});

export default {
  addToCart,
  removeFromCart,
  getCart,
  updateCartItemQuantity
};
