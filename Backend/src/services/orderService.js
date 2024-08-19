import db from "../models";
import emailService from "./emailService";
import CustomError from '../utils/CustomError';
import ERROR_CODES from '../errorCodes';

const OrderStatus = {
  PENDING: 0,
  CONFIRMED: 1,
  SHIPPING: 2,
  DELIVERED: 3,
  CANCELED: 4,
  RETURNED: 5
};

const handleErrors = (error) => {
  if (error instanceof CustomError) {
    throw error;
  }
  console.error('Service error:', error);
  throw new CustomError(ERROR_CODES.SERVER_ERROR);
};

const asyncHandler = (fn) => async (...args) => {
  try {
    return await fn(...args);
  } catch (error) {
    handleErrors(error);
  }
};

const createOrder = asyncHandler(async (user_id, cart_id, address_ship, payment_method, tax, delivery_date) => {
  const transaction = await db.sequelize.transaction();

  const cart = await db.Cart.findOne({
    where: {
      id: cart_id, user_id,
      status: OrderStatus.PENDING
    },
    include: [{
      model: db.CartItem,
      as: 'CartItems',
      include: ['Product']
    }]
  });

  if (!cart) {
    throw new CustomError(ERROR_CODES.CART_NOT_FOUND);
  }

  const total = cart.CartItems.reduce((acc, item) => {
    const total_item_price = item.quantity * parseFloat(item.Product.price);
    const taxed_price = total_item_price * (1 + tax / 100);
    return acc + taxed_price;
  }, 0);

  const order = await db.Order.create({
    user_id,
    total,
    address_ship,
    payment_method,
    tax,
    delivery_date,
    cart_id,
    createdAt: new Date(),
    updatedAt: new Date()
  }, { transaction });

  for (const cartItem of cart.CartItems) {
    const product = await db.Product.findByPk(cartItem.product_id);
    if (!product) {
      throw new CustomError(ERROR_CODES.PRODUCT_NOT_FOUND);
    }

    if (cartItem.quantity > product.stock) {
      throw new CustomError(ERROR_CODES.QUANTITY_EXCEEDS_STOCK);
    }

    product.stock -= cartItem.quantity;
    await product.save({ transaction });
  }

  cart.status = OrderStatus.CONFIRMED;
  await cart.save({ transaction });

  await transaction.commit();
  return order;
});

const validStatusTransitions = {
  [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELED],
  [OrderStatus.CONFIRMED]: [OrderStatus.SHIPPING, OrderStatus.CANCELED],
  [OrderStatus.SHIPPING]: [OrderStatus.DELIVERED, OrderStatus.RETURNED],
  [OrderStatus.DELIVERED]: [],
  [OrderStatus.CANCELED]: [],
  [OrderStatus.RETURNED]: []
};

const updateOrderStatus = asyncHandler(async (orderId, newStatus) => {
  const order = await db.Order.findByPk(orderId, {
    attributes: ['id', 'user_id', 'total', 'order_status', 'payment_method', 'address_ship', 'tax', 'delivery_date', 'cart_id', 'createdAt', 'updatedAt'],
    include: [{ model: db.Cart, as: 'cart', include: [{ model: db.CartItem, as: 'CartItems', include: ['Product'] }] }]
  });

  if (!order) {
    throw new CustomError(ERROR_CODES.ORDER_NOT_FOUND);
  }

  const currentStatus = order.order_status;
  const validTransitions = validStatusTransitions[currentStatus];

  if (!validTransitions.includes(newStatus)) {
    throw new CustomError(ERROR_CODES.INVALID_STATUS_TRANSITION);
  }

  order.order_status = newStatus;
  order.updatedAt = new Date();
  await order.save();

  if ([OrderStatus.DELIVERED, OrderStatus.CANCELED, OrderStatus.RETURNED].includes(newStatus)) {
    const user = await db.User.findByPk(order.user_id, { attributes: ['email'] });
    if (user && user.email) {
      let subject, text;

      if (newStatus === OrderStatus.DELIVERED) {
        subject = `Đơn hàng ${order.id} đã giao hàng thành công`;
        text = `Xin chào,

Đơn hàng của bạn với mã đơn hàng ${order.id} đã được giao thành công ngày ${new Date().toLocaleDateString()}.

Vui lòng đăng nhập để xác nhận bạn đã nhận hàng và hài lòng với sản phẩm trong vòng 3 ngày. Sau khi bạn xác nhận, chúng tôi sẽ thanh toán cho người bán. Nếu bạn không xác nhận trong khoảng thời gian này, chúng tôi cũng sẽ thanh toán cho người bán.

THÔNG TIN ĐƠN HÀNG - DÀNH CHO NGƯỜI MUA

Mã đơn hàng: ${order.id}
Ngày đặt hàng: ${new Date(order.createdAt).toLocaleDateString()}

Các sản phẩm:
${order.cart && order.cart.CartItems ? order.cart.CartItems.map(item => `
- ${item.Product.name}, Số lượng: ${item.quantity}, Giá: ₫${item.Product.price})
`).join('\n') : 'Thông tin sản phẩm không có'}

Tổng tiền: ₫${order.total}

Chúc bạn có những trải nghiệm tuyệt vời khi mua sắm tại chúng tôi.`;
      } else if (newStatus === OrderStatus.CANCELED) {
        subject = `Đơn hàng ${order.id} đã bị hủy`;
        text = `Xin chào,

Đơn hàng của bạn với mã đơn hàng ${order.id} đã bị hủy.

Chúng tôi xin lỗi vì sự bất tiện này. Nếu bạn có bất kỳ câu hỏi nào, xin vui lòng liên hệ với chúng tôi.

Trân trọng,`;
      } else if (newStatus === OrderStatus.RETURNED) {
        subject = `Đơn hàng ${order.id} đã hoàn trả`;
        text = `Xin chào,

Đơn hàng của bạn với mã đơn hàng ${order.id} đã được hoàn trả.

Chúng tôi sẽ xử lý hoàn tiền hoặc các bước tiếp theo và thông báo đến bạn trong thời gian sớm nhất.

Trân trọng,`;
      }

      await emailService.sendEmail(user.email, subject, text);
    }
  }

  return order;
});

const repurchaseOrder = asyncHandler(async (orderId, address_ship, payment_method, tax, delivery_date) => {
  const transaction = await db.sequelize.transaction();

  const oldOrder = await db.Order.findByPk(orderId, {
    include: [{ model: db.Cart, as: 'cart', include: [{ model: db.CartItem, as: 'CartItems', include: ['Product'] }] }]
  });

  if (!oldOrder) {
    throw new CustomError(ERROR_CODES.ORDER_NOT_FOUND);
  }

  const cart = await db.Cart.create({
    user_id: oldOrder.user_id,
    status: OrderStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date()
  }, { transaction });

  const newCartItems = oldOrder.cart.CartItems.map(item => ({
    cart_id: cart.id,
    product_id: item.product_id,
    quantity: item.quantity
  }));

  await db.CartItem.bulkCreate(newCartItems, { transaction });

  const total = oldOrder.total;

  const newOrder = await db.Order.create({
    user_id: oldOrder.user_id,
    total,
    address_ship,
    payment_method,
    tax,
    delivery_date,
    cart_id: cart.id,
    createdAt: new Date(),
    updatedAt: new Date()
  }, { transaction });

  await transaction.commit();
  return newOrder;
});

export default {
  createOrder,
  updateOrderStatus,
  repurchaseOrder
};
