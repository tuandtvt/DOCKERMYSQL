import cartService from "../services/cartService";

const addToCart = async (req, res, next) => {
  const { product_id, quantity } = req.body;
  const user_id = req.user.id;

  if (!product_id || !quantity) {
    return res.status(400).json({ message: 'Product ID and quantity are required' });
  }

  try {
    await cartService.addToCart(user_id, product_id, quantity);
    res.status(200).json({ message: 'Product added to cart' });
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  const { product_id } = req.params;
  const user_id = req.user.id;

  try {
    await cartService.removeFromCart(user_id, product_id);
    res.status(200).json({ message: 'Product removed from cart' });
  } catch (error) {
    next(error);
  }
};

const getCart = async (req, res, next) => {
  const user_id = req.user.id;

  try {
    const cartItems = await cartService.getCart(user_id);
    res.status(200).json(cartItems);
  } catch (error) {
    next(error);
  }
};

export default {
  addToCart,
  removeFromCart,
  getCart
};
