import express from 'express';
import errorHandler from '../middleware/errorHandler';
import authController from '../controllers/authController';
import productController from '../controllers/productController';
import authenticateToken from '../middleware/authMiddleware';
import cartController from '../controllers/cartController';
import orderController from '../controllers/orderController';


const router = express.Router();

const initApiRoutes = (app) => {

    router.post('/api/v1/register', authController.register);

    router.post('/api/v1/login', authController.login);

    router.post('/api/v1/forgot-password', authController.forgotPassword);

    router.post('/api/v1/reset-password', authController.resetPassword);

    router.get('/api/v1/products', productController.getAllProducts);

    router.get('/api/v1/user/products', authenticateToken, productController.getUserProducts);

    router.get('/api/v1/cart', authenticateToken, cartController.getCart);

    router.post('/api/v1/cart/add', authenticateToken, cartController.addToCart);

    router.post('/api/v1/buy', authenticateToken, orderController.placeOrder);

    router.post('/api/v1/user/updateNotificationToken', authenticateToken, authController.updateNotificationToken);

    // app.use('/api/v1', router);
    app.use('/', router);

    app.use(errorHandler);
};

export default initApiRoutes;