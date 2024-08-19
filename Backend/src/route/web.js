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
import shopController from '../controllers/shopController';


const router = express.Router();

const initWebRoutes = (app) => {

  // Welcome route
  router.get('/', (req, res) => {
    res.send('Welcome to the API');
  });

  // Xác thực và quản lý người dùng (đăng ký, đăng nhập, quên mật khẩu, đổi mật khẩu)
  router.post('/register', authController.register);
  router.get('/verify/:token', authController.verifyAccount);
  router.post('/login', authController.login);
  router.post('/change-password', authenticateToken, authController.changePassword);
  router.post('/forgot-password', authController.forgotPassword);
  router.post('/reset-password', authController.resetPassword);

  // Quản lý sản phẩm (thêm sản phẩm, lấy sản phẩm của người dùng, cập nhật giá sản phẩm, danh sách sản phẩm)
  router.post('/add', authenticateToken, productController.addProduct);
  router.get('/user/products', authenticateToken, productController.getUserProducts);
  router.put('/product/update-price', authenticateToken, checkRole('manage'), productController.updateProductPrice);
  router.get('/products', productController.getAllProducts);

  // Quản lý đơn hàng (đặt hàng, cập nhật trạng thái đơn hàng, mua lại đơn hàng)
  router.post('/buy', authenticateToken, orderController.placeOrder);
  router.put('/order/update-status', authenticateToken, orderController.updateOrderStatus);
  router.post('/orders/repurchase', authenticateToken, orderController.repurchaseOrder);

  // Quản lý giỏ hàng (thêm vào giỏ, xóa khỏi giỏ, cập nhật số lượng, lấy thông tin giỏ hàng)
  router.post('/cart/add', authenticateToken, cartController.addToCart);
  router.delete('/cart/remove/:cartItem_id', authenticateToken, cartController.removeFromCart);
  router.put('/cart/update/:cartItem_id', authenticateToken, cartController.updateCartItemQuantity);
  router.get('/cart', cartController.getCart);

  // Quản lý vai trò và quyền (thêm vai trò, thêm quyền, gán quyền cho vai trò, gán vai trò cho người dùng)
  router.post('/add-role', roleController.addRole);
  router.post('/add-permision', permisionController.addPermision);
  router.post('/role/:roleId/permision', permisionController.assignPermisionToRole);
  router.post('/user/:userId/role', roleController.assignRoleToUser);
  // Quản lý đánh giá sản phẩm (thêm đánh giá, lấy đánh giá sản phẩm)
  router.post('/product/:product_id/review', authenticateToken, reviewController.addReview);
  router.get('/product/:product_id/reviews', reviewController.getProductReviews);

  // Quản lý shop (thêm shop, cập nhật thông tin shop, lấy thông tin shop, thêm sản phẩm vào shop, cập nhật trạng thái sản phẩm trong shop, lấy sản phẩm theo shop, cập nhật theo dõi/hủy follow shop)
  router.post('/shop/add', shopController.addShop);
  router.put('/shop/:shopId/update', shopController.updateShop);
  router.get('/shop/:shopId', shopController.getShop);
  router.post('/shop/:shopId/product/add', shopController.addProductToShop);
  router.put('/shop/:shopId/product/:productId/update-status', shopController.updateProductStatusInShop);
  router.get('/shop/:shopId/products', shopController.getProductsByShop);
  router.put('/shop/:shopId/follow', shopController.updateFollowStatus);

  // Error handling middleware
  app.use('/', router);
  app.use(errorHandler);
};

export default initWebRoutes;
