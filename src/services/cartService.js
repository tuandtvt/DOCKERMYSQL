import db from "../models";
const addToCart = async (user_id, product_id, quantity) => {
  const product = await db.Product.findByPk(product_id);
  if (!product) {
    throw new Error('Product not found');
  }

  let cart = await db.Cart.findOne({ where: { user_id } });
  if (!cart) {
    cart = await db.Cart.create({ user_id });
  }

  const [cartItem, created] = await db.CartItem.findOrCreate({
    where: { cart_id: cart.id, product_id },
    defaults: { quantity }
  });

  if (!created) {
    cartItem.quantity += quantity;
    await cartItem.save();
  }

  return { message: 'Product added to cart' };
};

const removeFromCart = async (user_id, product_id) => {
  const cart = await db.Cart.findOne({ where: { user_id } });
  if (!cart) {
    throw new Error('Cart not found');
  }

  const cartItem = await db.CartItem.findOne({ where: { cart_id: cart.id, product_id } });

  if (cartItem) {
    await db.CartItem.destroy({ where: { cart_id: cart.id, product_id } });
    return { message: 'Product removed from cart' };
  } else {
    throw new Error('Cart item not found');
  }
};

const getCart = async (user_id) => {
  const cart = await db.Cart.findOne({
    where: { user_id },
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
};

const clearCart = async (user_id) => {
  const cart = await db.Cart.findOne({ where: { user_id } });
  if (cart) {
    await db.CartItem.destroy({ where: { cart_id: cart.id } });
    return { message: 'Cart cleared' };
  } else {
    throw new Error('Cart not found');
  }
};

export default {
  addToCart,
  removeFromCart,
  getCart,
  clearCart
};
