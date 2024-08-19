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

const addToCart = asyncHandler(async (user_id, product_id, quantity) => {
  const product = await db.Product.findByPk(product_id);
  if (!product) {
    throw new CustomError(ERROR_CODES.PRODUCT_NOT_FOUND);
  }

  if (quantity > product.stock) {
    throw new CustomError(ERROR_CODES.QUANTITY_EXCEEDS_STOCK);
  }

  let cart = await db.Cart.findOne({ where: { user_id, status: 0 } });
  if (!cart) {
    cart = await db.Cart.create({ user_id, status: 0 });
  }

  const [cartItem, created] = await db.CartItem.findOrCreate({
    where: {
      cart_id: cart.id,
      product_id
    },
    defaults: { quantity }
  });

  if (!created) {
    const newQuantity = cartItem.quantity + quantity;
    if (newQuantity > product.stock) {
      throw new CustomError(ERROR_CODES.QUANTITY_EXCEEDS_STOCK);
    }
    cartItem.quantity = newQuantity;
    await cartItem.save();
  } else {
    cartItem.quantity = quantity;
    await cartItem.save();
  }

  return { message: 'Product added to cart' };
});

const removeFromCart = asyncHandler(async (user_id, cartItem_id) => {
  const cartItem = await db.CartItem.findOne({ where: { id: cartItem_id } });
  if (!cartItem) {
    throw new CustomError(ERROR_CODES.CART_ITEM_NOT_FOUND);
  }

  await db.CartItem.destroy({ where: { id: cartItem_id } });
  return { message: 'Cart item removed' };
});

const getCart = asyncHandler(async (user_id) => {
  const cart = await db.Cart.findOne({
    where: { user_id, status: 0 },
    include: [
      {
        model: db.CartItem,
        as: 'CartItems',
        include: [
          {
            model: db.Product,
            as: 'Product'
          }
        ]
      }
    ]
  });

  if (!cart) {
    return [];
  }

  return {
    id: cart.id,
    user_id: cart.user_id,
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt,
    products: cart.CartItems.map(cartItem => ({
      id: cartItem.Product.id,
      name: cartItem.Product.name,
      price: cartItem.Product.price,
      quantity: cartItem.quantity
    }))
  };
});

const updateCartItemQuantity = asyncHandler(async (user_id, cartItem_id, quantity) => {
  const cartItem = await db.CartItem.findOne({ where: { id: cartItem_id } });
  if (!cartItem) {
    throw new CustomError(ERROR_CODES.CART_ITEM_NOT_FOUND);
  }

  const cart = await db.Cart.findOne({ where: { id: cartItem.cart_id, user_id } });
  if (!cart) {
    throw new CustomError(ERROR_CODES.CART_NOT_FOUND);
  }

  const product = await db.Product.findByPk(cartItem.product_id);
  if (!product) {
    throw new CustomError(ERROR_CODES.PRODUCT_NOT_FOUND);
  }

  const currentStock = product.stock + cartItem.quantity;
  if (quantity > currentStock) {
    throw new CustomError(ERROR_CODES.QUANTITY_EXCEEDS_STOCK);
  }

  product.stock = currentStock - quantity;
  await product.save();

  cartItem.quantity = quantity;
  await cartItem.save();

  return { message: 'Cart item quantity updated' };
});

export default {
  addToCart,
  removeFromCart,
  getCart,
  updateCartItemQuantity
};
