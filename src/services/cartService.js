import db from "../models";

const addToCart = async (user_id, product_id, quantity) => {
  const product = await db.Product.findByPk(product_id);
  if (!product) {
    throw new Error('Product not found');
  }

  const [cartItem, created] = await db.Cart.findOrCreate({
    where: { user_id, product_id },
    defaults: { quantity }
  });

  if (!created) {
    cartItem.quantity += quantity;
    await cartItem.save();
  }

  return { message: 'Product added to cart' };
};

const removeFromCart = async (user_id, product_id) => {
  const cartItem = await db.Cart.findOne({ where: { user_id, product_id } });

  if (cartItem) {
    await db.Cart.destroy({ where: { user_id, product_id } });
    return { message: 'Product removed from cart' };
  } else {
    throw new Error('Cart item not found');
  }
};

const getCart = async (user_id) => {
    const carts = await db.Cart.findAll({
      where: { user_id },
      include: [
        {
          model: db.Product,
          as: 'Product'
        }
      ],
      raw: true,
      nest: true
    });
  
  
    return carts.map(cart => {
      const { Product, ...rest } = cart;
      return {
        ...rest,
        product: Product 
      };
    });
  };
  
  

const clearCart = async (user_id) => {
  await db.Cart.destroy({ where: { user_id } });
  return { message: 'Cart cleared' };
};

export default {
  addToCart,
  removeFromCart,
  getCart,
  clearCart
};