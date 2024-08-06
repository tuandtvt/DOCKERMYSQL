import db from "../models";

const createOrder = async (user_id, cart_id, address_ship, payment_method, tax, delivery_date) => {
  const transaction = await db.sequelize.transaction();

  try {
    const cart = await db.Cart.findOne({
      where: { id: cart_id, user_id },
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

    await transaction.commit();
    return order;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updateOrderStatus = async (orderId, order_status) => {
  const order = await db.Order.findByPk(orderId);

  if (!order) {
    throw new Error('Order not found');
  }

  order.order_status = order_status;
  await order.save();

  return order;
};


export default {
  createOrder,
  updateOrderStatus
};
