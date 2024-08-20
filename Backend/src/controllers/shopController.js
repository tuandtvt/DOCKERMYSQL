import shopService from '../services/shopService';
import notificationsService from '../services/notificationsService';
import ERROR_CODES from '../errorCodes';
import { asyncHandler } from "../utils/CustomError";

const addShop = asyncHandler(async (req, res) => {
    const { name_shop, avatar_shop, background_shop, description, address_shop, user_follow, start_time, status, topic } = req.body;
    console.log('nameshop', name_shop)
    if (!name_shop) {
        return res.status(400).json({ message: ERROR_CODES.INVALID_REQUEST });
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

const updateShop = asyncHandler(async (req, res) => {
    const { shopId } = req.params;
    const { name_shop, avatar_shop, background_shop, description, address_shop, user_follow, start_time, status, topic } = req.body;
    if (!name_shop && !avatar_shop && !background_shop && !description && !address_shop && user_follow === undefined && !start_time && status === undefined && !topic) {
        return res.status(400).json({ message: ERROR_CODES.INVALID_REQUEST });
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

const getShop = asyncHandler(async (req, res) => {
    const { shopId } = req.params;
    const shop = await shopService.getShopById(shopId);
    if (!shop) {
        return res.status(400).json({ message: ERROR_CODES.SHOP_NOT_FOUND });
    }
    res.status(200).json(shop);
});

const addProductToShop = asyncHandler(async (req, res) => {
    const { shopId } = req.params;
    const { productId, status } = req.body;
    if (!productId || status === undefined) {
        return res.status(400).json({ message: ERROR_CODES.INVALID_REQUEST });
    }
    const result = await shopService.addProductToShop(shopId, productId, status);

    const shop = await shopService.getShopById(shopId);
    if (shop && shop.topic) {
        await notificationsService.sendNotificationToTopic(shop.topic, {
            title: 'Sản phẩm mới trong shop',
            body: `Sản phẩm mới đã được thêm vào shop!`
        });
    }
    res.status(201).json(result);
});

const updateProductStatusInShop = asyncHandler(async (req, res) => {
    const { shopId, productId } = req.params;
    const { status } = req.body;
    if (status === undefined) {
        return res.status(400).json({ message: ERROR_CODES.INVALID_REQUEST });
    }
    const result = await shopService.updateProductStatus(shopId, productId, status);
    res.status(200).json(result);
});

const getProductsByShop = asyncHandler(async (req, res) => {
    const { shopId } = req.params;
    const products = await shopService.getProductsByShop(shopId);
    res.status(200).json(products);
});

const updateFollowStatus = asyncHandler(async (req, res) => {
    const { shopId } = req.params;
    const userId = req.user.id;
    const { status } = req.body;

    if (status === undefined) {
        return res.status(400).json({ message: ERROR_CODES.INVALID_REQUEST });
    }

    const statusValue = parseInt(status, 10);
    if (isNaN(statusValue) || (statusValue !== 0 && statusValue !== 1)) {
        return res.status(400).json({ message: ERROR_CODES.INVALID_STATUS_VALUE });
    }

    const result = await shopService.updateFollowStatus(userId, shopId, statusValue);

    if (statusValue === 1) {
        const user = await db.User.findByPk(userId);
        if (user && user.notificationToken) {
            const topic = `shop_${shopId}`;
            await notificationsService.subscribeToTopic(user.notificationToken, topic);
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
