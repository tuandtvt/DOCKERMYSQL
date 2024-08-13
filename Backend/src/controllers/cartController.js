import cartService from "../services/cartService";


const addToCart = async (req, res, next) => {
  console.log('1', req.body)
  console.log('2', req.user.id)
  const { product_id, quantity } = req.body;
  const user_id = req.user.id;

  if (!product_id || !quantity) {
    return res.status(400).json({ message: 'Product ID and quantity are required' });
  }

  try {
    await cartService.addToCart(user_id, product_id, quantity);
    console.log('pass serviceeeeeeeeeeeeeeeeeeeeeeeeeee',)
    res.status(200).json({ message: 'Product added to cart' });
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  const { cartItem_id } = req.params;
  const user_id = req.user.id;

  try {
    await cartService.removeFromCart(user_id, cartItem_id);
    res.status(200).json({ message: 'Cart item removed' });
  } catch (error) {
    next(error);
  }
};


const getCart = async (req, res, next) => {
  console.log('<<c ', req.user)
  const user_id = req.user.id;

  try {
    const cartItems = await cartService.getCart(user_id);
    res.status(200).json(cartItems);
  } catch (error) {
    next(error);
  }
};



const updateCartItemQuantity = async (req, res, next) => {
  const { cartItem_id } = req.params;
  const { quantity } = req.body;
  const user_id = req.user.id;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Valid quantity is required' });
  }

  try {
    await cartService.updateCartItemQuantity(user_id, cartItem_id, quantity);
    res.status(200).json({ message: 'Cart item quantity updated' });
  } catch (error) {
    next(error);
  }
};


export default {
  addToCart,
  removeFromCart,
  getCart,
  updateCartItemQuantity
};
