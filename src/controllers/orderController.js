import orderService from "../services/orderService";
import CustomError from '../utils/CustomError';
import ERROR_CODES from '../errorCodes';

const buyProduct = async (req, res, next) => {
  const { product_id, quantity, discount, shipping_cost, tax, gift, delivery_date, payment_method, address_ship } = req.body;
  const user_id = req.user.id; 

  if (!product_id || !quantity || !discount || !shipping_cost || !tax || !gift || !delivery_date || !payment_method || !address_ship) {
    return next(new CustomError(ERROR_CODES.INVALID_REQUEST));
  }

  try {
    const result = await orderService.buyProduct(user_id, product_id, quantity, discount, shipping_cost, tax, gift, delivery_date, payment_method, address_ship);
    res.status(201).json(result);
  } catch (error) {
    if (error.message === 'Product not found') {
      return next(new CustomError(ERROR_CODES.PRODUCT_NOT_FOUND));
    }
    if (error.message === 'Insufficient stock') {
      return next(new CustomError(ERROR_CODES.INSUFFICIENT_STOCK));
    }
    console.error(error);
    next(new CustomError(ERROR_CODES.SERVER_ERROR));
  }
};

const updateOrder = async (req, res) => {
  try {
    const { order_id, quantity, discount, shipping_cost, tax } = req.body;

    if (!order_id || quantity === undefined || discount === undefined || shipping_cost === undefined || tax === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await orderService.updateOrderTotal(order_id, quantity, discount, shipping_cost, tax);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in updateOrder:", error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default {
  buyProduct,
  updateOrder
};
