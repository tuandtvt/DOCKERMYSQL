import db from '../models';
import CustomError from '../utils/CustomError';
import ERROR_CODES from '../errorCodes';

const handleErrors = (error) => {
    if (error instanceof CustomError) {
        throw error;
    }
    console.error('Service error:', error);
    throw new CustomError(ERROR_CODES.SERVER_ERROR);
};

const asyncHandler = (fn) => async (...args) => {
    try {
        return await fn(...args);
    } catch (error) {
        handleErrors(error);
    }
};
const createShop = asyncHandler(async (shopData) => {
    const newShop = await db.Shop.create(shopData);
    return newShop;
});

const updateShop = async (shopId, updateData) => {
    const shop = await db.Shop.findByPk(shopId);
    if (!shop) {
        throw new Error('Shop not found');
    }

    for (const [key, value] of Object.entries(updateData)) {
        if (value !== undefined) {
            shop[key] = value;
        }
    }

    await shop.save();
    return shop;
};

const getShopById = async (shopId) => {
    return db.Shop.findByPk(shopId);
};

const addProductToShop = async (shopId, productId, status) => {
    const shop = await db.Shop.findByPk(shopId);
    if (!shop) {
        throw new Error('Shop not found');
    }

    const product = await db.Product.findByPk(productId);
    if (!product) {
        throw new Error('Product not found');
    }

    return db.ShopProduct.create({
        shop_id: shopId,
        product_id: productId,
        status
    });
};

const updateProductStatus = async (shopId, productId, status) => {
    const shopProduct = await db.ShopProduct.findOne({
        where: { shop_id: shopId, product_id: productId }
    });

    if (!shopProduct) {
        throw new Error('Product not found in this shop');
    }

    shopProduct.status = status;
    await shopProduct.save();
    return shopProduct;
};

const getProductsByShop = async (shopId) => {
    const shopProducts = await db.ShopProduct.findAll({
        where: { shop_id: shopId },
        include: [{ model: db.Product, as: 'Product' }]
    });

    const formattedShopProducts = shopProducts.map(shopProduct => {
        const product = shopProduct.Product;
        return {
            id: shopProduct.id,
            shop_id: shopProduct.shop_id,
            product_id: shopProduct.product_id,
            status: shopProduct.status,
            createdAt: shopProduct.createdAt,
            updatedAt: shopProduct.updatedAt,
            product: {
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt
            }
        };
    });

    return formattedShopProducts;
};


const getUsersFollowingShop = async (shopId) => {
    return db.ShopUser.findAll({
        where: { shop_id: shopId, status: 1 },
        include: [{ model: db.User, as: 'User' }]
    });
};


const updateFollowStatus = async (userId, shopId, status) => {
    if (typeof status !== 'number' || (status !== 0 && status !== 1)) {
        throw new Error('Invalid status value. It must be 0 or 1.');
    }

    const followRecord = await db.ShopUser.findOne({
        where: { user_id: userId, shop_id: shopId }
    });

    if (followRecord) {
        if (followRecord.status === 0 && status === 1) {
            followRecord.status = status;
            await followRecord.save();
            return followRecord;
        } else if (followRecord.status === 1 && status === 0) {

            followRecord.status = status;
            await followRecord.save();
            return followRecord;
        } else {
            throw new Error('User already follows this shop or already unfollowed.');
        }
    } else {

        if (status === 1) {
            return db.ShopUser.create({
                user_id: userId,
                shop_id: shopId,
                status
            });
        } else {
            throw new Error('User does not follow this shop yet.');
        }
    }
};

export default {
    createShop,
    updateShop,
    getShopById,
    addProductToShop,
    updateProductStatus,
    getProductsByShop,
    getUsersFollowingShop,
    updateFollowStatus
};