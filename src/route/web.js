require("dotenv").config();
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

const router = express.Router();

const initWebRoutes = (app) => {
  router.post('/api/register', authController.register);
  router.post('/api/login',  authController.login);

  router.post('/api/add', authenticateToken, checkRole('admin'), checkPermision('update'), productController.addProduct);

  router.post('/api/buy', authenticateToken, checkRole('admin'), orderController.buyProduct);
 
  router.get('/api/user/products', authenticateToken, productController.getUserProducts);

  router.put('/api/product/update-price', authenticateToken, checkRole('manage'), productController.updateProductPrice);

  router.put('/api/update-order', authenticateToken, orderController.updateOrder);

  router.get('/admin/dashboard', authenticateToken, checkRole('admin'), (req, res) => {
    res.json({ message: 'Welcome to admin dashboard' });
  });

  router.post('/api/add-role', roleController.addRole);

  router.post('/api/add-permision', permisionController.addPermision);

  router.post('/api/role/:roleId/permision', permisionController.assignPermisionToRole);

  router.post('/api/user/:userId/role', roleController.assignRoleToUser);

  app.use('/', router);

  app.use(errorHandler)
};

export default initWebRoutes;
