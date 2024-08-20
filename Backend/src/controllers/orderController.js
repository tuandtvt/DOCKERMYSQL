import orderService from "../services/orderService";
import notificationsService from "../services/notificationsService";
import { asyncHandler, sendResponse } from '../utils/CustomError';
import db from "../models";

const OrderStatus = {
  PENDING: 0,
  CONFIRMED: 1,
  SHIPPING: 2,
  DELIVERED: 3,
  CANCELED: 4,
  RETURNED: 5
};

const placeOrder = asyncHandler(async (req, res) => {
  const { cart_id, address_ship, payment_method, tax, delivery_date } = req.body;
  const user_id = req.user.id;

  if (!cart_id || !address_ship || !payment_method || tax === undefined || !delivery_date) {
    return sendResponse(res, { message: 'Cart ID, address, payment method, tax, and delivery date are required' }, 400);
  }

  const order = await orderService.createOrder(user_id, cart_id, address_ship, payment_method, tax, delivery_date);

  if (order.message) {
    return sendResponse(res, { message: order.message }, 400);
  }

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

  sendResponse(res, order, 201);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId, status } = req.body;

  if (!orderId || status === undefined) {
    return sendResponse(res, { message: 'Order ID and status are required' }, 400);
  }

  const validStatuses = Object.values(OrderStatus);
  if (!validStatuses.includes(parseInt(status, 10))) {
    return sendResponse(res, { message: 'Invalid status' }, 400);
  }

  const updatedOrder = await orderService.updateOrderStatus(orderId, parseInt(status, 10));

  if (updatedOrder.message) {
    return sendResponse(res, { message: updatedOrder.message }, 400);
  }

  sendResponse(res, updatedOrder);
});

const repurchaseOrder = asyncHandler(async (req, res) => {
  const { orderId, address_ship, payment_method, tax, delivery_date } = req.body;
  const user_id = req.user.id;

  if (!orderId || !address_ship || !payment_method || tax === undefined || !delivery_date) {
    return sendResponse(res, { message: 'Order ID, address, payment method, tax, and delivery date are required' }, 400);
  }

  const newOrder = await orderService.repurchaseOrder(orderId, address_ship, payment_method, tax, delivery_date);

  if (newOrder.message) {
    return sendResponse(res, { message: newOrder.message }, 400);
  }

  sendResponse(res, newOrder, 201);
});

export default {
  placeOrder,
  updateOrderStatus,
  repurchaseOrder
};
