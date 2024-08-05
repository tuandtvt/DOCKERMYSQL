import orderService from "../services/orderService";
import cartService from "../services/cartService"; 
import CustomError from '../utils/CustomError';
import ERROR_CODES from '../errorCodes';

const placeOrder = async (req, res, next) => {
  const user_id = req.user.id;
  const { address_ship, payment_method, discount, shipping_cost, tax, gift, delivery_date } = req.body;

  if (!address_ship || !payment_method || discount === undefined || shipping_cost === undefined || tax === undefined || !gift || !delivery_date) {
    return res.status(400).json({ message: 'Address, payment method, discount, shipping cost, tax, gift, and delivery date are required' });
  }

  try {
    const cartItems = await cartService.getCart(user_id);

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orders = await orderService.createOrder(user_id, cartItems, address_ship, payment_method, discount, shipping_cost, tax, gift, delivery_date);

    await cartService.clearCart(user_id);

    res.status(201).json(orders);
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
