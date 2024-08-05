import db from "../models";

const buyProduct = async (user_id, product_id, quantity, discount, shipping_cost, tax, gift, delivery_date, payment_method, address_ship) => {
  try {
    const product = await db.Product.findByPk(product_id);
    if (!product) {
      throw new Error('Product not found');
    }

    if (product.stock < quantity) {
      throw new Error('Insufficient stock');
    }

    const price = product.price;
    const totalBeforeTax = price * quantity * (1 - discount / 100);
    const total = totalBeforeTax + totalBeforeTax * (tax / 100) + shipping_cost;

    await db.Order.create({
      user_id,
      product_id,
      quantity,
      price,
      total,
      discount,
      shipping_cost,
      tax,
      gift,
      delivery_date,
      payment_method,
      address_ship
    });

    await db.Product.update(
      { stock: product.stock - quantity },
      { where: { id: product_id } }
    );

    return { message: 'Order placed successfully' };
  } catch (error) {
    console.error("Error buying product:", error);
    throw error;
  }
};

const updateOrderTotal = async (order_id, new_quantity, new_discount, new_shipping_cost, new_tax) => {
  try {
 
    const order = await db.Order.findByPk(order_id);
    if (!order) {
      throw new Error('Order not found');
    }


    const product = await db.Product.findByPk(order.product_id);
    if (!product) {
      throw new Error('Product not found');
    }

    
    const price = product.price;
    const totalBeforeTax = price * new_quantity * (1 - new_discount / 100);
    const total = totalBeforeTax + totalBeforeTax * (new_tax / 100) + new_shipping_cost;

   
    await db.Order.update({
      quantity: new_quantity,
      total: total,
      discount: new_discount,
      shipping_cost: new_shipping_cost,
      tax: new_tax
    }, {
      where: { id: order_id }
    });

    return { message: 'Order updated successfully' };
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

export default {
  buyProduct,
  updateOrderTotal
};
