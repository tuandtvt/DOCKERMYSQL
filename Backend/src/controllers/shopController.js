import shopService from '../services/shopService';
import notificationsService from '../services/notificationsService';
import CustomError from '../utils/CustomError';
import ERROR_CODES from '../errorCodes';
import db from '../models';

const addShop = async (req, res, next) => {
    const { name_shop, avatar_shop, background_shop, description, address_shop, user_follow, start_time, status, topic } = req.body;

    if (!name_shop) {
        return res.status(400).json({ message: 'Tên shop là bắt buộc' });
    }

    try {
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
    } catch (error) {
        console.error("Error adding shop:", error);
        next(new CustomError(ERROR_CODES.SERVER_ERROR));
    }
};

const updateShop = async (req, res, next) => {
    const { shopId } = req.params;
    const { name_shop, avatar_shop, background_shop, description, address_shop, user_follow, start_time, status, topic } = req.body;

    if (!name_shop && !avatar_shop && !background_shop && !description && !address_shop && user_follow === undefined && !start_time && status === undefined && !topic) {
        return res.status(400).json({ message: 'At least one field is required to update' });
    }

    try {
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
    } catch (error) {
        console.error("Error updating shop:", error);
        next(new CustomError(ERROR_CODES.SERVER_ERROR));
    }
};

const getShop = async (req, res, next) => {
    const { shopId } = req.params;

    try {
        const shop = await shopService.getShopById(shopId);
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }
        res.status(200).json(shop);
    } catch (error) {
        console.error("Error fetching shop:", error);
        next(new CustomError(ERROR_CODES.SERVER_ERROR));
    }
};

const addProductToShop = async (req, res, next) => {
    const { shopId } = req.params;
    const { productId, status } = req.body;

    if (!productId || status === undefined) {
        return res.status(400).json({ message: 'Product ID and status are required' });
    }

    try {
        const shopProduct = await shopService.addProductToShop(shopId, productId, status);

        // const usersFollowingShop = await shopService.getUsersFollowingShop(shopId);
        // if (usersFollowingShop.length > 0) {
        //     const message = {
        //         title: 'Sản phẩm mới trong shop',
        //         body: `Sản phẩm với ID ${productId} đã được thêm vào shop với ID ${shopId}.`
        //     };
        //     for (const user of usersFollowingShop) {
        //         if (user.User && user.User.notificationToken) {
        //             await notificationsService.sendNotification(user.User.notificationToken, message);
        //         }
        //     }
        // }

        const shop = await shopService.getShopById(shopId);
        if (shop && shop.topic) {
            console.log('Topic:', shop.topic);
            await notificationsService.sendNotificationToTopic(shop.topic, {
                title: 'Sản phẩm mới trong shop',
                body: `Sản phẩm mới đã được thêm vào shop!`
            });
        }

        res.status(201).json(shopProduct);
    } catch (error) {
        console.error("Error adding product to shop:", error);
        next(new CustomError(ERROR_CODES.SERVER_ERROR));
    }
};


const updateProductStatusInShop = async (req, res, next) => {
    const { shopId, productId } = req.params;
    const { status } = req.body;

    if (status === undefined) {
        return res.status(400).json({ message: 'Status is required' });
    }

    try {
        const updatedProduct = await shopService.updateProductStatus(shopId, productId, status);
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Error updating product status in shop:", error);
        next(new CustomError(ERROR_CODES.SERVER_ERROR));
    }
};

const getProductsByShop = async (req, res, next) => {
    const { shopId } = req.params;

    try {
        const products = await shopService.getProductsByShop(shopId);
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products by shop:", error);
        next(new CustomError(ERROR_CODES.SERVER_ERROR));
    }
};



const updateFollowStatus = async (req, res, next) => {
    const { shopId } = req.params;
    const { userId, status } = req.body;

    if (status === undefined) {
        return res.status(400).json({ message: 'Status is required' });
    }

    if (userId === undefined) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    const statusValue = parseInt(status, 10);
    if (isNaN(statusValue) || (statusValue !== 0 && statusValue !== 1)) {
        return res.status(400).json({ message: 'Invalid status value. It must be 0 or 1.' });
    }

    try {
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
    } catch (error) {
        console.error("Error updating follow status:", error);
        next(new CustomError(ERROR_CODES.SERVER_ERROR));
    }
};



export default {
    addShop,
    updateShop,
    getShop,
    addProductToShop,
    updateProductStatusInShop,
    getProductsByShop,
    updateFollowStatus
};
