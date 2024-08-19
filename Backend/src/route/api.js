import express from 'express';
import errorHandler from '../middleware/errorHandler';
import authController from '../controllers/authController';
import productController from '../controllers/productController';
import authenticateToken from '../middleware/authMiddleware';
import cartController from '../controllers/cartController';
import orderController from '../controllers/orderController';
import reviewController from '../controllers/reviewController';
import shopController from '../controllers/shopController';
import roleController from '../controllers/roleController';
import permisionController from '../controllers/permisionController';
import checkRole from '../middleware/checkRole';

const router = express.Router();

const initApiRoutes = (app) => {

    // Xác thực và quản lý người dùng (đăng ký, đăng nhập, quên mật khẩu, đổi mật khẩu)
    router.post('/api/v1/register', authController.register);
    router.get('/api/v1/verify/:token', authController.verifyAccount);
    router.post('/api/v1/login', authController.login);
    router.post('/api/v1/change-password', authenticateToken, authController.changePassword);
    router.post('/api/v1/forgot-password', authController.forgotPassword);
    router.post('/api/v1/reset-password', authController.resetPassword);
    router.post('/api/v1/update-notification-token', authController.updateNotificationToken);

    // Quản lý vai trò và quyền (thêm vai trò, thêm quyền, gán quyền cho vai trò, gán vai trò cho người dùng)
    router.post('/api/v1/add-role', authenticateToken, roleController.addRole);
    router.post('/api/v1/add-permision', authenticateToken, permisionController.addPermision);
    router.post('/api/v1/role/:roleId/permision', authenticateToken, permisionController.assignPermisionToRole);
    router.post('/api/v1/user/:userId/role', authenticateToken, roleController.assignRoleToUser);

    // Quản lý giỏ hàng (thêm vào giỏ, xóa khỏi giỏ, cập nhật số lượng, lấy thông tin giỏ hàng)
    router.post('/api/v1/cart/add', authenticateToken, cartController.addToCart);
    router.delete('/api/v1/cart/remove/:cartItem_id', authenticateToken, cartController.removeFromCart);
    router.put('/api/v1/cart/update/:cartItem_id', authenticateToken, cartController.updateCartItemQuantity);
    router.get('/api/v1/cart', authenticateToken, cartController.getCart);

    // Quản lý đơn hàng (đặt hàng, cập nhật trạng thái đơn hàng, mua lại đơn hàng)
    router.post('/api/v1/buy', authenticateToken, orderController.placeOrder);
    router.put('/api/v1/order/update-status', authenticateToken, orderController.updateOrderStatus);
    router.post('/api/v1/orders/repurchase', authenticateToken, orderController.repurchaseOrder);

    // Quản lý sản phẩm (thêm sản phẩm, lấy sản phẩm của người dùng, cập nhật giá sản phẩm, danh sách sản phẩm)
    router.post('/api/v1/add', authenticateToken, productController.addProduct);
    router.get('/api/v1/user/products', authenticateToken, productController.getUserProducts);
    router.put('/api/v1/product/update-price', authenticateToken, productController.updateProductPrice);
    router.get('/api/v1/products', productController.getAllProducts);

    // Quản lý đánh giá sản phẩm (thêm đánh giá, lấy đánh giá sản phẩm)
    router.post('/api/v1/product/:product_id/review', authenticateToken, reviewController.addReview);
    router.get('/api/v1/product/:product_id/reviews', reviewController.getProductReviews);

    // Quản lý shop (thêm shop, cập nhật thông tin shop, lấy thông tin shop, thêm sản phẩm vào shop, cập nhật trạng thái sản phẩm trong shop, lấy sản phẩm theo shop, cập nhật theo dõi/hủy follow shop)
    router.post('/api/v1/shop/add', shopController.addShop);
    router.put('/api/v1/shop/:shopId/update', authenticateToken, shopController.updateShop);
    router.get('/api/v1/shop/:shopId', authenticateToken, shopController.getShop);
    router.post('/api/v1/shop/:shopId/product/add', authenticateToken, shopController.addProductToShop);
    router.put('/api/v1/shop/:shopId/product/:productId/update-status', authenticateToken, shopController.updateProductStatusInShop);
    router.get('/api/v1/shop/:shopId/products', authenticateToken, shopController.getProductsByShop);
    router.put('/api/v1/shop/:shopId/follow', authenticateToken, shopController.updateFollowStatus);

    // app.use('/api/v1', router);
    app.use('/', router);

    app.use(errorHandler);
};

export default initApiRoutes;