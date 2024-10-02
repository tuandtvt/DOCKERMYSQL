module.exports = (sequelize, DataTypes) => {
    const ShopProduct = sequelize.define('ShopProduct', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        shop_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Shops',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Products',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                isIn: [[0, 1, 2]] // 0: out of stock, 1: available for sale, 2: no longer sold
            }
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'ShopProducts',
        timestamps: true
    });

    ShopProduct.associate = function (models) {
        ShopProduct.belongsTo(models.Shop, { foreignKey: 'shop_id', as: 'Shop' });
        ShopProduct.belongsTo(models.Product, { foreignKey: 'product_id', as: 'Product' });
    };

    return ShopProduct;
};
