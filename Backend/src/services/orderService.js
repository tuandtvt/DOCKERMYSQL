import db from "../models";
import emailService from "./emailService";

const createOrder = async (user_id, cart_id, address_ship, payment_method, tax, delivery_date) => {
  const transaction = await db.sequelize.transaction();

  try {
    const cart = await db.Cart.findOne({
      where: { id: cart_id, user_id, status: 0 },
      include: [{ model: db.CartItem, as: 'CartItems', include: ['Product'] }]
    });

    if (!cart) {
      throw new Error('Cart not found');
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
        throw new Error('Product not found');
      }

      if (cartItem.quantity > product.stock) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }

      product.stock -= cartItem.quantity;
      await product.save({ transaction });
    }

    cart.status = 1;
    await cart.save({ transaction });

    await transaction.commit();
    return order;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const validStatusTransitions = {
  pending: ['confirmed', 'canceled'],
  confirmed: ['shipping', 'canceled'],
  shipping: ['delivered', 'returned'],
  delivered: [],
  canceled: [], 
  returned: []
};

const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const order = await db.Order.findByPk(orderId, {
      attributes: ['id', 'user_id', 'total', 'order_status', 'payment_method', 'address_ship', 'tax', 'delivery_date', 'cart_id', 'createdAt', 'updatedAt'],
      include: [{ model: db.Cart, as: 'cart', include: [{ model: db.CartItem, as: 'CartItems', include: ['Product'] }] }]
    });

    if (!order) {
      throw new Error('Đơn hàng không tồn tại');
    }

    const currentStatus = order.order_status;
    const validTransitions = validStatusTransitions[currentStatus];

    if (!validTransitions.includes(newStatus)) {
      throw new Error(`Chuyển đổi từ trạng thái ${currentStatus} sang ${newStatus} không hợp lệ`);
    }

    order.order_status = newStatus;
    order.updatedAt = new Date();
    await order.save();

    if (['delivered', 'canceled', 'returned'].includes(newStatus)) {
      const user = await db.User.findByPk(order.user_id, { attributes: ['email'] });
      if (user && user.email) {
        let subject, text;

        if (newStatus === 'delivered') {
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
        } else if (newStatus === 'canceled') {
          subject = `Đơn hàng ${order.id} đã bị hủy`;
          text = `Xin chào,

Đơn hàng của bạn với mã đơn hàng ${order.id} đã bị hủy.

Chúng tôi xin lỗi vì sự bất tiện này. Nếu bạn có bất kỳ câu hỏi nào, xin vui lòng liên hệ với chúng tôi.

Trân trọng,`;
        } else if (newStatus === 'returned') {
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
  } catch (error) {
    throw error;
  }
};

const repurchaseOrder = async (orderId, user_id, address_ship, payment_method, tax, delivery_date) => {
  const transaction = await db.sequelize.transaction();

  try {
    const oldOrder = await db.Order.findByPk(orderId, {
      include: [{ model: db.Cart, as: 'cart', include: [{ model: db.CartItem, as: 'CartItems', include: ['Product'] }] }]
    });

    if (!oldOrder) {
      throw new Error('Đơn hàng không tồn tại');
    }

    const cart = await db.Cart.create({
      user_id,
      status: 0,
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
      user_id,
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
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};


export default {
  createOrder,
  updateOrderStatus,
  repurchaseOrder
};
