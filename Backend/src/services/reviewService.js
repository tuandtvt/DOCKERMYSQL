import db from "../models";

const addReview = async (user_id, product_id, rating, comment) => {
    try {

      console.log('Parameters:', { user_id, product_id, rating, comment });
  
      const order = await db.Order.findOne({
        include: [{
            model: db.Cart,
            as: 'cart',
            include: [{
              model: db.CartItem,
              as: 'CartItems',
              where: { product_id }  
            }]
          }],
        where: {
          user_id,
          order_status: 'delivered'
        }
      });

      
      console.log('Retrieved Order:', order);
  
      if (!order) {
        console.log('Order not found or not delivered');
        throw new Error('Bạn chưa mua hoặc chưa nhận sản phẩm này');
      }
  
      const review = await db.Review.create({
        user_id,
        product_id,
        rating,
        comment,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
     
      console.log('Created Review:', review);
      
      return review;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  };

const getProductReviews = async (product_id) => {
  try {
    console.log('Starting getProductReviews function');
    
   
    console.log('Parameter:', { product_id });
    
    const reviews = await db.Review.findAll({
      where: { product_id },
      include: [{ model: db.User, attributes: ['id', 'username'] }]
    });
    
    
    console.log('Retrieved Reviews:', reviews);
    
    return reviews;
  } catch (error) {
    console.error('Error getting product reviews:', error);
    throw error;
  }
};

export default {
  addReview,
  getProductReviews
};
