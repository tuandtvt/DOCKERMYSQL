import db from '../models';
import ERROR_CODES from '../errorCodes';

const createShop = async (shopData) => {
    try {
        return await db.Shop.create(shopData);
    } catch (error) {
        console.error('Service error:', error);
        return { message: ERROR_CODES.SERVER_ERROR };
    }
};

const updateShop = async (shopId, updateData) => {
    try {
        const shop = await db.Shop.findByPk(shopId);
        if (!shop) {
            return { message: ERROR_CODES.SHOP_NOT_FOUND };
        }

        for (const [key, value] of Object.entries(updateData)) {
            if (value !== undefined) {
                shop[key] = value;
            }
        }

        await shop.save();
        return shop;
    } catch (error) {
        console.error('Service error:', error);
        return { message: ERROR_CODES.SERVER_ERROR };
    }
};

const getShopById = async (shopId) => {
    return db.Shop.findByPk(shopId);
};

const addProductToShop = async (shopId, productId, status) => {
    try {
        const shop = await db.Shop.findByPk(shopId);
        if (!shop) {
            return { message: ERROR_CODES.SHOP_NOT_FOUND };
        }

        const product = await db.Product.findByPk(productId);
        if (!product) {
            return { message: ERROR_CODES.PRODUCT_NOT_FOUND };
        }

        return await db.ShopProduct.create({
            shop_id: shopId,
            product_id: productId,
            status
        });
    } catch (error) {
        console.error('Service error:', error);
        return { message: ERROR_CODES.SERVER_ERROR };
    }
};

const updateProductStatus = async (shopId, productId, status) => {
    try {
        const shopProduct = await db.ShopProduct.findOne({
            where: { shop_id: shopId, product_id: productId }
        });

        if (!shopProduct) {
            return { message: ERROR_CODES.PRODUCT_NOT_FOUND_IN_SHOP };
        }

        shopProduct.status = status;
        await shopProduct.save();
        return shopProduct;
    } catch (error) {
        console.error('Service error:', error);
        return { message: ERROR_CODES.SERVER_ERROR };
    }
};

const getProductsByShop = async (shopId) => {
    const shopProducts = await db.ShopProduct.findAll({
        where: { shop_id: shopId },
        include: [{ model: db.Product, as: 'Product' }]
    });

    return shopProducts.map(shopProduct => {
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
};

const updateFollowStatus = async (userId, shopId, status) => {
    try {
        if (typeof status !== 'number' || (status !== 0 && status !== 1)) {
            return { message: ERROR_CODES.INVALID_STATUS_VALUE };
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
                return { message: ERROR_CODES.FOLLOW_STATUS_UNCHANGED };
            }
        } else {
            if (status === 1) {
                return await db.ShopUser.create({
                    user_id: userId,
                    shop_id: shopId,
                    status
                });
            } else {
                return { message: ERROR_CODES.FOLLOW_STATUS_NOT_EXIST };
            }
        }
    } catch (error) {
        console.error('Service error:', error);
        return { message: ERROR_CODES.SERVER_ERROR };
    }
};

export default {
    createShop,
    updateShop,
    getShopById,
    addProductToShop,
    updateProductStatus,
    getProductsByShop,
    updateFollowStatus
};
