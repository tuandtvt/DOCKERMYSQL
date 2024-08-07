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
      attributes: ['id', 'user_id', 'total', 'order_status', 'payment_method', 'address_ship', 'tax', 'delivery_date', 'cart_id', 'createdAt', 'updatedAt']
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
        const subject = `Order ${newStatus}`;
        const text = `Your order with ID ${order.id} has been ${newStatus}.`;
        await emailService.sendEmail(user.email, subject, text);
      }
    }

    return order;
  } catch (error) {
    throw error;
  }
};

export default {
  createOrder,
  updateOrderStatus
};
