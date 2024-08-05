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

const router = express.Router();

const initWebRoutes = (app) => {
  router.post('/api/register', authController.register);
  router.post('/api/login', authController.login);

  router.post('/api/add', authenticateToken, checkRole('admin'), checkPermision('update'), productController.addProduct);

  router.post('/api/buy', authenticateToken, orderController.placeOrder);

  router.post('/api/cart/add', authenticateToken, cartController.addToCart);

  router.delete('/api/cart/remove/:product_id', authenticateToken, cartController.removeFromCart);

  router.get('/api/cart', authenticateToken, cartController.getCart);

  router.put('/api/order/:orderId/status', authenticateToken, checkRole('admin'), orderController.updateOrderStatus);

  router.get('/api/user/products', authenticateToken, productController.getUserProducts);

  router.put('/api/product/update-price', authenticateToken, checkRole('manage'), productController.updateProductPrice);

  router.post('/api/add-role', roleController.addRole);

  router.post('/api/add-permision', permisionController.addPermision);

  router.post('/api/role/:roleId/permision', permisionController.assignPermisionToRole);

  router.post('/api/user/:userId/role', roleController.assignRoleToUser);

  app.use('/', router);

  app.use(errorHandler);
};

export default initWebRoutes;