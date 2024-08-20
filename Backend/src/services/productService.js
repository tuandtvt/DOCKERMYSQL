import db from "../models";
import ERROR_CODES from '../errorCodes';

const addProduct = async (name, description, price, stock = 0) => {
  try {
    const newProduct = await db.Product.create({
      name,
      description,
      price,
      stock
    });
    return { message: 'Product added successfully', product: newProduct };
  } catch (error) {
    console.error('Service error:', error);
    return { message: ERROR_CODES.PRODUCT_CREATION_FAILED };
  }
};

const getUserProducts = async (userId) => {
  try {
    const carts = await db.Cart.findAll({
      where: { user_id: userId, status: 1 },
      include: [{
        model: db.CartItem,
        as: 'CartItems',
        include: [{
          model: db.Product,
          as: 'Product',
          attributes: ['id', 'name', 'description', 'price', 'stock', 'createdAt', 'updatedAt']
        }]
      }]
    });

    const formattedProducts = carts.flatMap(cart =>
      cart.CartItems.map(cartItem => ({
        cartId: cart.id,
        cartItemId: cartItem.id,
        productId: cartItem.product_id,
        quantity: cartItem.quantity,
        cartCreatedAt: cart.createdAt,
        cartUpdatedAt: cart.updatedAt,
        product: {
          id: cartItem.Product.id,
          name: cartItem.Product.name,
          description: cartItem.Product.description,
          price: cartItem.Product.price,
          stock: cartItem.Product.stock,
          createdAt: cartItem.Product.createdAt,
          updatedAt: cartItem.Product.updatedAt
        }
      }))
    );
    return formattedProducts;
  } catch (error) {
    console.error('Service error:', error);
    return { message: ERROR_CODES.PRODUCT_FETCH_FAILED };
  }
};

const updateProductPrice = async (productId, newPrice) => {
  try {
    const [updated] = await db.Product.update({ price: newPrice }, {
      where: { id: productId }
    });

    if (!updated) {
      return { message: ERROR_CODES.PRODUCT_NOT_FOUND };
    }

    const updatedProduct = await db.Product.findByPk(productId);
    return { message: 'Product price updated successfully', product: updatedProduct };
  } catch (error) {
    console.error('Service error:', error);
    return { message: ERROR_CODES.PRODUCT_PRICE_UPDATE_FAILED };
  }
};

const getAllProducts = async () => {
  try {
    const products = await db.Product.findAll({
      attributes: ['id', 'name', 'description', 'price', 'stock', 'createdAt', 'updatedAt']
    });
    return products;
  } catch (error) {
    console.error('Service error:', error);
    return { message: ERROR_CODES.PRODUCT_FETCH_FAILED };
  }
};

export default {
  addProduct,
  getUserProducts,
  updateProductPrice,
  getAllProducts
};
