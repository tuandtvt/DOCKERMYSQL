import db from "../models";

const addProduct = async (name, description, price, stock = 0) => {
  try {
    const newProduct = await db.Product.create({
      name,
      description,
      price,
      stock
    });

    return { message: 'Product added successfully', product: newProduct };
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

const getUserProducts = async (userId) => {
  try {
    const orders = await db.Order.findAll({
      where: { user_id: userId },
      include: [{ model: db.Product, as: 'Product' }],
      raw: true
    });

  
    const formattedOrders = orders.map(order => {
      const { 
        'Product.id': productId, 
        'Product.name': productName, 
        'Product.description': productDescription, 
        'Product.price': productPrice, 
        'Product.stock': productStock, 
        'Product.createdAt': productCreatedAt, 
        'Product.updatedAt': productUpdatedAt, 
        ...orderData 
      } = order;
      
      orderData.Product = {
        id: productId,
        name: productName,
        description: productDescription,
        price: productPrice,
        stock: productStock,
        createdAt: productCreatedAt,
        updatedAt: productUpdatedAt
      };

      return orderData;
    });

    return formattedOrders;
  } catch (error) {
    console.error('Error fetching user products:', error);
    throw error;
  }
};

const updateProductPrice = async (productId, newPrice) => {
  try {
    const [updated] = await db.Product.update({ price: newPrice }, {
      where: { id: productId }
    });

    if (!updated) {
      throw new Error('Product not found');
    }

    const updatedProduct = await db.Product.findByPk(productId);

    return { message: 'Product price updated successfully', product: updatedProduct };
  } catch (error) {
    console.error("Error updating product price:", error);
    throw error;
  }
};

export default {
  addProduct,
  getUserProducts,
  updateProductPrice
};
