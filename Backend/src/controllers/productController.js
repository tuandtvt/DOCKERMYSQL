import productService from "../services/productService";
import ERROR_CODES from '../errorCodes';

const addProduct = async (req, res) => {
  const { name, description, price, stock } = req.body;

  if (!name || !price || !stock) {
    return res.status(400).json({ message: ERROR_CODES.INVALID_REQUEST });
  }

  const result = await productService.addProduct(name, description, price, stock);
  if (result.message === 'Failed to add product') {
    return res.status(500).json({ message: result.message });
  }

  res.status(201).json(result);
};

const getUserProducts = async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ message: ERROR_CODES.INVALID_REQUEST });
  }

  const result = await productService.getUserProducts(userId);
  if (result.message === 'Failed to get user products') {
    return res.status(500).json({ message: result.message });
  }

  res.status(200).json(result);
};

const updateProductPrice = async (req, res) => {
  const { productId, newPrice } = req.body;

  if (!productId || newPrice == null) {
    return res.status(400).json({ message: ERROR_CODES.INVALID_REQUEST });
  }

  const result = await productService.updateProductPrice(productId, newPrice);
  if (result.message === 'Product not found') {
    return res.status(404).json({ message: result.message });
  } else if (result.message === 'Failed to update product price') {
    return res.status(500).json({ message: result.message });
  }

  res.status(200).json(result);
};

const getAllProducts = async (req, res) => {
  const result = await productService.getAllProducts();
  if (result.message === 'Failed to get all products') {
    return res.status(500).json({ message: result.message });
  }

  res.status(200).json(result);
};

export default {
  addProduct,
  getUserProducts,
  updateProductPrice,
  getAllProducts
};
