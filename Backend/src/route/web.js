import express from 'express';
import authController from '../controllers/authController';
import orderController from '../controllers/orderController';
import productController from '../controllers/productController';
import authenticateToken from '../middleware/authMiddleware';
import errorHandler from '../middleware/errorHandler';
import checkRole from '../middleware/checkRole';
import roleController from '../controllers/roleController';
import permisionController from '../controllers/permisionController';
import checkPermision from '../middleware/checkPermision';
import cartController from '../controllers/cartController';
import reviewController from '../controllers/reviewController';

const router = express.Router();

const initWebRoutes = (app) => {

  // Welcome route
  router.get('/', (req, res) => {
    res.send('Welcome to the API');
  });

  // Xác thực và quản lý người dùng (đăng ký, đăng nhập, quên mật khẩu, đổi mật khẩu)
  router.post('/api/register', authController.register);
  router.get('/api/verify/:token', authController.verifyAccount);
  router.post('/login', authController.login);
  router.post('/api/change-password', authenticateToken, authController.changePassword);
  router.post('/api/forgot-password', authController.forgotPassword);
  router.post('/api/reset-password', authController.resetPassword);

  // Quản lý sản phẩm (thêm sản phẩm, lấy sản phẩm của người dùng, cập nhật giá sản phẩm, danh sách sản phẩm)
  router.post('/api/add', authenticateToken, productController.addProduct);
  router.get('/api/user/products', authenticateToken, productController.getUserProducts);
  router.put('/api/product/update-price', authenticateToken, checkRole('manage'), productController.updateProductPrice);
  router.get('/api/products', productController.getAllProducts);

  // Quản lý đơn hàng (đặt hàng, cập nhật trạng thái đơn hàng, mua lại đơn hàng)
  router.post('/api/buy', authenticateToken, orderController.placeOrder);
  router.put('/api/order/update-status', authenticateToken, orderController.updateOrderStatus);
  router.post('/api/orders/repurchase', authenticateToken, orderController.repurchaseOrder);

  // Quản lý giỏ hàng (thêm vào giỏ, xóa khỏi giỏ, cập nhật số lượng, lấy thông tin giỏ hàng)
  router.post('/api/cart/add', authenticateToken, cartController.addToCart);
  router.delete('/api/cart/remove/:cartItem_id', authenticateToken, cartController.removeFromCart);
  router.put('/api/cart/update/:cartItem_id', authenticateToken, cartController.updateCartItemQuantity);
  router.get('/api/cart', cartController.getCart);

  // Quản lý vai trò và quyền (thêm vai trò, thêm quyền, gán quyền cho vai trò, gán vai trò cho người dùng)
  router.post('/api/add-role', roleController.addRole);
  router.post('/api/add-permision', permisionController.addPermision);
  router.post('/api/role/:roleId/permision', permisionController.assignPermisionToRole);
  router.post('/api/user/:userId/role', roleController.assignRoleToUser);

  // Quản lý đánh giá sản phẩm (thêm đánh giá, lấy đánh giá sản phẩm)
  router.post('/api/product/:product_id/review', authenticateToken, reviewController.addReview);
  router.get('/api/product/:product_id/reviews', reviewController.getProductReviews);

  // Error handling middleware
  app.use('/', router);
  app.use(errorHandler);
};

export default initWebRoutes;
