import orderService from "../services/orderService";
import cartService from "../services/cartService"; 
import CustomError from '../utils/CustomError';
import ERROR_CODES from '../errorCodes';

const placeOrder = async (req, res, next) => {
  const { user_id, cart_id, address_ship, payment_method, tax, delivery_date } = req.body;

  if (!user_id || !cart_id || !address_ship || !payment_method || tax === undefined || !delivery_date) {
    return res.status(400).json({ message: 'User ID, Cart ID, address, payment method, tax, and delivery date are required' });
  }

  try {
    const order = await orderService.createOrder(user_id, cart_id, address_ship, payment_method, tax, delivery_date);
    res.status(201).json(order);
  } catch (error) {
    console.error("Error placing order:", error);
    next(new CustomError(ERROR_CODES.SERVER_ERROR));
  }
};

const updateOrderStatus = async (req, res, next) => {
  const { orderId } = req.params;
  const { order_status } = req.body;

  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'canceled', 'returned'];

  if (!validStatuses.includes(order_status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const result = await orderService.updateOrderStatus(orderId, order_status);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error updating order status:", error);
    next(new CustomError(ERROR_CODES.SERVER_ERROR));
  }
};

export default {
  placeOrder,
  updateOrderStatus
};
