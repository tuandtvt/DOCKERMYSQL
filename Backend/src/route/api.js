import express from 'express';
import errorHandler from '../middleware/errorHandler';
import authController from '../controllers/authController';
import productController from '../controllers/productController';
import authenticateToken from '../middleware/authMiddleware';
import cartController from '../controllers/cartController';



const router = express.Router();

const initApiRoutes = (app) => {

    router.post('/api/v1/register', authController.register);

    router.post('/api/v1/login', authController.login);

    router.get('/api/v1/user/products', authenticateToken, productController.getUserProducts);

    router.get('/api/v1/cart', authenticateToken, cartController.getCart);

    // app.use('/api/v1', router);
    app.use('/', router);

    app.use(errorHandler);
};

export default initApiRoutes;