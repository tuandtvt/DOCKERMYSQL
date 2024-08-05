import db from "../models";

const createOrder = async (user_id, cartItems, address_ship, payment_method, discount, shipping_cost, tax, gift, delivery_date) => {
  const transaction = await db.sequelize.transaction();

  try {
   
    const total = cartItems.reduce((acc, item) => {
      const total_item_price = item.quantity * parseFloat(item.product.price);
      const discounted_price = total_item_price * (1 - discount / 100);
      const taxed_price = discounted_price * (1 + tax / 100);
      return acc + taxed_price;
    }, 0) + shipping_cost;

   
    for (const item of cartItems) {
      const product = await db.Product.findOne({ where: { id: item.product.id } });

      if (!product) {
        throw new Error(`Product with id ${item.product.id} not found.`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Not enough stock for product ${product.name}. Only ${product.stock} left.`);
      }
    }

   
    const orderData = cartItems.map(item => ({
      user_id,
      product_id: item.product.id, 
      quantity: item.quantity,
      price: item.product.price,
      total,
      address_ship,
      payment_method,
      discount,
      shipping_cost,
      tax,
      gift,
      delivery_date,
      order_status: 'pending'
    }));

    const orders = await db.Order.bulkCreate(orderData, { transaction });

   
    for (const item of cartItems) {
      await db.Product.update(
        { stock: db.Sequelize.literal(`GREATEST(stock - ${item.quantity}, 0)`) }, 
        { where: { id: item.product.id }, transaction } 
      );
    }

    await transaction.commit();

    return orders;
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating order:", error);
    throw error;
  }
};



const getOrderById = async (orderId) => {
  return await db.Order.findByPk(orderId);
};

const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const order = await getOrderById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const validTransitions = {
      'pending': ['confirmed'],
      'confirmed': ['shipped'],
      'shipped': ['delivered'],
      'delivered': [],
      'canceled': [],
      'returned': []
    };

    const currentStatus = order.order_status;
    const allowedNextStatuses = validTransitions[currentStatus];

    if (!allowedNextStatuses.includes(newStatus)) {
      throw new Error('Invalid status transition');
    }

    const [updated] = await db.Order.update(
      { order_status: newStatus },
      { where: { id: orderId } }
    );

    if (updated) {
      return { message: 'Order status updated successfully' };
    } else {
      throw new Error('Order not found');
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export default {
  createOrder,
  updateOrderStatus
};