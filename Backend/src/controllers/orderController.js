import orderService from "../services/orderService";
import cartService from "../services/cartService";
import notificationsService from "../services/notificationsService";
import CustomError from '../utils/CustomError';
import ERROR_CODES from '../errorCodes';
import { or } from "sequelize";
import db from "../models";




const placeOrder = async (req, res, next) => {
  const { user_id, cart_id, address_ship, payment_method, tax, delivery_date } = req.body;

  if (!user_id || !cart_id || !address_ship || !payment_method || tax === undefined || !delivery_date) {
    return res.status(400).json({ message: 'User ID, Cart ID, address, payment method, tax, and delivery date are required' });
  }

  try {

    const order = await orderService.createOrder(user_id, cart_id, address_ship, payment_method, tax, delivery_date);


    const user = await db.User.findByPk(user_id);
    const userToken = user ? user.notificationToken : null;


    const message = {
      title: 'Đặt hàng thành công',
      body:
        `Đơn hàng ID: ${order.id}\n` +
        `Địa chỉ giao hàng: ${order.address_ship}\n` +
        `Phương thức thanh toán: ${order.payment_method}\n` +
        `Tổng số tiền: ${order.total}`
    };


    if (userToken) {
      console.log('Sending notification:', message);
      try {
        await notificationsService.sendNotification(userToken, message);
        console.log('Notification sent successfully');
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }
    res.status(201).json({
      order: order,
      message: 'Order placed successfully'
    });
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

const repurchaseOrder = async (req, res, next) => {
  const { orderId, user_id, address_ship, payment_method, tax, delivery_date } = req.body;
  console.log('>>>check', orderId, user_id, address_ship, payment_method, tax, delivery_date);
  if (!orderId || !user_id || !address_ship || !payment_method || tax === undefined || !delivery_date) {
    return res.status(400).json({ message: 'Order ID, User ID, address, payment method, tax, and delivery date are required' });
  }

  try {
    const newOrder = await orderService.repurchaseOrder(orderId, user_id, address_ship, payment_method, tax, delivery_date);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error repurchasing order:", error);
    next(new CustomError(ERROR_CODES.SERVER_ERROR));
  }
};


export default {
  placeOrder,
  updateOrderStatus,
  repurchaseOrder
};
