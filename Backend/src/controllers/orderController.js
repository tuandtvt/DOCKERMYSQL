import orderService from "../services/orderService";
import notificationsService from "../services/notificationsService";
import CustomError from '../utils/CustomError';
import ERROR_CODES from '../errorCodes';
import db from "../models";

const OrderStatus = {
  PENDING: 0,
  CONFIRMED: 1,
  SHIPPING: 2,
  DELIVERED: 3,
  CANCELED: 4,
  RETURNED: 5
};

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

const placeOrder = asyncHandler(async (req, res) => {
  const { cart_id, address_ship, payment_method, tax, delivery_date } = req.body;
  const user_id = req.user.id;

  if (!cart_id || !address_ship || !payment_method || tax === undefined || !delivery_date) {
    return res.status(400).json({ message: 'Cart ID, address, payment method, tax, and delivery date are required' });
  }

  const order = await orderService.createOrder(user_id, cart_id, address_ship, payment_method, tax, delivery_date);

  const user = await db.User.findByPk(user_id);
  const userToken = user ? user.notificationToken : null;

  const message = {
    title: 'Đặt hàng thành công',
    body: `Đơn hàng ID: ${order.id}\nĐịa chỉ giao hàng: ${order.address_ship}\nPhương thức thanh toán: ${order.payment_method}\nTổng số tiền: ${order.total}`
  };

  if (userToken) {
    try {
      await notificationsService.sendNotification(userToken, message);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  res.status(201).json({
    order,
    message: 'Order placed successfully'
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId, status } = req.body;

  if (!orderId || status === undefined) {
    return res.status(400).json({ message: 'Order ID and status are required' });
  }

  const validStatuses = Object.values(OrderStatus);
  if (!validStatuses.includes(parseInt(status, 10))) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const updatedOrder = await orderService.updateOrderStatus(orderId, parseInt(status, 10));
  res.status(200).json(updatedOrder);
});

const repurchaseOrder = asyncHandler(async (req, res) => {
  const { orderId, address_ship, payment_method, tax, delivery_date } = req.body;
  const user_id = req.user.id;

  if (!orderId || !address_ship || !payment_method || tax === undefined || !delivery_date) {
    return res.status(400).json({ message: 'Order ID, address, payment method, tax, and delivery date are required' });
  }

  const newOrder = await orderService.repurchaseOrder(orderId, user_id, address_ship, payment_method, tax, delivery_date);
  res.status(201).json(newOrder);
});

export default {
  placeOrder,
  updateOrderStatus,
  repurchaseOrder
};
