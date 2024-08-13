import db from "../models";



const addToCart = async (user_id, product_id, quantity) => {
  const product = await db.Product.findByPk(product_id);
  if (!product) {
    throw new Error('Product not found');
  }

  if (quantity > product.stock) {
    throw new Error('Quantity exceeds available stock');
  }

  let cart = await db.Cart.findOne({ where: { user_id, status: 0 } });

  console.log('4444444444444444444444', cart)

  if (!cart) {
    cart = await db.Cart.create({ user_id, status: 0 });
  }

  const [cartItem, created] = await db.CartItem.findOrCreate({
    where: { cart_id: cart.id, product_id },
    defaults: { quantity }
  });
  console.log('5555555555555555555555555', cartItem)
  if (!created) {
    const newQuantity = cartItem.quantity + quantity;
    if (newQuantity > product.stock) {
      throw new Error('Quantity exceeds available stock');
    }
    cartItem.quantity = newQuantity;
    await cartItem.save();
  } else {
    cartItem.quantity = quantity;
    await cartItem.save();
  }

  return { message: 'Product added to cart' };
};



const removeFromCart = async (user_id, cartItem_id) => {
  const cartItem = await db.CartItem.findOne({ where: { id: cartItem_id } });
  if (!cartItem) {
    throw new Error('Cart item not found');
  }

  const cart = await db.Cart.findOne({ where: { id: cartItem.cart_id, user_id } });
  if (!cart) {
    throw new Error('Cart not found');
  }

  await db.CartItem.destroy({ where: { id: cartItem_id } });
  return { message: 'Cart item removed' };
};



const getCart = async (user_id) => {
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


const updateCartItemQuantity = async (user_id, cartItem_id, quantity) => {
  const cartItem = await db.CartItem.findOne({ where: { id: cartItem_id } });
  if (!cartItem) {
    throw new Error('Cart item not found');
  }

  const cart = await db.Cart.findOne({ where: { id: cartItem.cart_id, user_id } });
  if (!cart) {
    throw new Error('Cart not found');
  }

  const product = await db.Product.findByPk(cartItem.product_id);
  if (!product) {
    throw new Error('Product not found');
  }

  const currentStock = product.stock + cartItem.quantity;
  if (quantity > currentStock) {
    throw new Error('Quantity exceeds available stock');
  }

  product.stock = currentStock - quantity;
  await product.save();

  cartItem.quantity = quantity;
  await cartItem.save();

  return { message: 'Cart item quantity updated' };
};



export default {
  addToCart,
  removeFromCart,
  getCart,
  clearCart,
  updateCartItemQuantity
};
