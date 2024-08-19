import productService from "../services/productService";
import CustomError from '../utils/CustomError';
import ERROR_CODES from '../errorCodes';

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

const addProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, stock } = req.body;

  if (!name || !price || !stock) {
    return next(new CustomError(ERROR_CODES.INVALID_REQUEST));
  }
  const result = await productService.addProduct(name, description, price, stock);
  res.status(201).json(result);
});


const getUserProducts = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    return next(new CustomError(ERROR_CODES.INVALID_REQUEST));
  }

  const products = await productService.getUserProducts(userId);
  res.status(200).json(products);
});

const updateProductPrice = asyncHandler(async (req, res, next) => {
  const { productId, newPrice } = req.body;
  if (!productId || newPrice == null) {
    return next(new CustomError(ERROR_CODES.INVALID_REQUEST));
  }
  const result = await productService.updateProductPrice(productId, newPrice);
  res.status(200).json(result);
});

const getAllProducts = asyncHandler(async (req, res, next) => {
  const products = await productService.getAllProducts();
  res.status(200).json(products);
});


export default {
  addProduct,
  getUserProducts,
  updateProductPrice,
  getAllProducts
};
