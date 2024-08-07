import productService from "../services/productService";
import CustomError from '../utils/CustomError';
import ERROR_CODES from '../errorCodes';

const addProduct = async (req, res, next) => {
  const { name, description, price, stock } = req.body;

  if (!name || !price) {
    return next(new CustomError(ERROR_CODES.INVALID_REQUEST));
  }

  try {
    const result = await productService.addProduct(name, description, price, stock);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      console.error('Error adding product:', error);
      next(new CustomError(ERROR_CODES.SERVER_ERROR));
    }
  }
};


const getUserProducts = async (req, res, next) => {
  try {
    const userId = req.user.id; 
    if (!userId) {
      return next(new CustomError(ERROR_CODES.INVALID_REQUEST));
    }
    
    const products = await productService.getUserProducts(userId);
    res.status(200).json(products);
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      console.error('Error fetching user products:', error);
      next(new CustomError(ERROR_CODES.SERVER_ERROR));
    }
  }
};



const updateProductPrice = async (req, res, next) => {
  const { productId, newPrice } = req.body;

  if (!productId || newPrice == null) {
    return next(new CustomError(ERROR_CODES.INVALID_REQUEST));
  }

  try {
    const result = await productService.updateProductPrice(productId, newPrice);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      console.error('Error updating product price:', error);
      next(new CustomError(ERROR_CODES.SERVER_ERROR));
    }
  }
};

export default {
  addProduct,
  getUserProducts,
  updateProductPrice
};
