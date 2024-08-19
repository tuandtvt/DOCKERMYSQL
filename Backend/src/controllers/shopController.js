import shopService from '../services/shopService';
import notificationsService from '../services/notificationsService';
import CustomError from '../utils/CustomError';
import ERROR_CODES from '../errorCodes';
import db from '../models';

const handleErrors = (res, error) => {
    if (error instanceof CustomError) {
        res.status(error.status || 400).json({ error: error.message });
    } else {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => handleErrors(res, error));
};

const addShop = asyncHandler(async (req, res, next) => {
    const { name_shop, avatar_shop, background_shop, description, address_shop, user_follow, start_time, status, topic } = req.body;
    if (!name_shop) {
        return next(new CustomError(ERROR_CODES.INVALID_REQUEST));
    }
    const newShop = await shopService.createShop({
        name_shop,
        avatar_shop,
        background_shop,
        description,
        address_shop,
        user_follow,
        start_time,
        status,
        topic
    });
    res.status(201).json(newShop);
});

const updateShop = asyncHandler(async (req, res, next) => {
    const { shopId } = req.params;
    const { name_shop, avatar_shop, background_shop, description, address_shop, user_follow, start_time, status, topic } = req.body;
    if (!name_shop && !avatar_shop && !background_shop && !description && !address_shop && user_follow === undefined && !start_time && status === undefined && !topic) {
        return next(new CustomError(ERROR_CODES.INVALID_REQUEST));
    }
    const updatedShop = await shopService.updateShop(shopId, {
        name_shop,
        avatar_shop,
        background_shop,
        description,
        address_shop,
        user_follow,
        start_time,
        status,
        topic
    });
    res.status(200).json(updatedShop);
});

const getShop = asyncHandler(async (req, res, next) => {
    const { shopId } = req.params;
    const shop = await shopService.getShopById(shopId);
    if (!shop) {
        return next(new CustomError(ERROR_CODES.INVALID_REQUEST));
    }
    res.status(200).json(shop);
});

const addProductToShop = asyncHandler(async (req, res, next) => {
    const { shopId } = req.params;
    const { productId, status } = req.body;
    if (!productId || status === undefined) {
        return next(new CustomError(ERROR_CODES.INVALID_REQUEST));
    }
    const shopProduct = await shopService.addProductToShop(shopId, productId, status);
    const shop = await shopService.getShopById(shopId);
    if (shop && shop.topic) {
        console.log('Topic:', shop.topic);
        await notificationsService.sendNotificationToTopic(shop.topic, {
            title: 'Sản phẩm mới trong shop',
            body: `Sản phẩm mới đã được thêm vào shop!`
        });
    }
    res.status(201).json(shopProduct);
});


const updateProductStatusInShop = asyncHandler(async (req, res, next) => {
    const { shopId, productId } = req.params;
    const { status } = req.body;

    if (status === undefined) {
        return next(new CustomError(ERROR_CODES.INVALID_REQUEST));
    }
    const updatedProduct = await shopService.updateProductStatus(shopId, productId, status);
    res.status(200).json(updatedProduct);
});

const getProductsByShop = asyncHandler(async (req, res, next) => {
    const { shopId } = req.params;
    const products = await shopService.getProductsByShop(shopId);
    res.status(200).json(products);
});


const updateFollowStatus = asyncHandler(async (req, res, next) => {
    const { shopId } = req.params;
    const userId = req.user.id;
    const { status } = req.body;

    if (status === undefined) {
        return res.status(400).json({ message: 'Status is required' });
    }

    const statusValue = parseInt(status, 10);
    if (isNaN(statusValue) || (statusValue !== 0 && statusValue !== 1)) {
        return res.status(400).json({ message: 'Invalid status value. It must be 0 or 1.' });
    }

    const result = await shopService.updateFollowStatus(userId, shopId, statusValue);

    if (statusValue === 1) {
        const user = await db.User.findByPk(userId);
        if (user && user.notificationToken) {
            const topic = `shop_${shopId}`;
            const subscribeResponse = await notificationsService.subscribeToTopic(user.notificationToken, topic);
            console.log('Subscribe response:', subscribeResponse);
        }
    }

    res.status(200).json(result);
});



export default {
    addShop,
    updateShop,
    getShop,
    addProductToShop,
    updateProductStatusInShop,
    getProductsByShop,
    updateFollowStatus
};