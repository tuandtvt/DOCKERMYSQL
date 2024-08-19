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

const addProduct = asyncHandler(async (name, description, price, stock = 0) => {
  const newProduct = await db.Product.create({
    name,
    description,
    price,
    stock
  });
  return { message: 'Product added successfully', product: newProduct };
});


const getUserProducts = asyncHandler(async (userId) => {
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
});

const updateProductPrice = asyncHandler(async (productId, newPrice) => {
  const [updated] = await db.Product.update({ price: newPrice }, {
    where: { id: productId }
  });

  if (!updated) {
    throw new Error('Product not found');
  }

  const updatedProduct = await db.Product.findByPk(productId);

  return { message: 'Product price updated successfully', product: updatedProduct };
});

const getAllProducts = asyncHandler(async () => {
  const products = await db.Product.findAll({
    attributes: ['id', 'name', 'description', 'price', 'stock', 'createdAt', 'updatedAt']
  });

  return products;
});

export default {
  addProduct,
  getUserProducts,
  updateProductPrice,
  getAllProducts
};
