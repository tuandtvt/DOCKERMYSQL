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
  const { orderId, status } = req.body;

  if (!orderId || !status) {
    return res.status(400).json({ message: 'Order ID và trạng thái là bắt buộc' });
  }

  const validStatuses = ['pending', 'confirmed', 'shipping', 'delivered', 'canceled', 'returned'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
  }

  try {
    const updatedOrder = await orderService.updateOrderStatus(orderId, status);
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error.message);
    res.status(400).json({ message: error.message });
  }
};


export default {
  placeOrder,
  updateOrderStatus
};
