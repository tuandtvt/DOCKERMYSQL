module.exports = (sequelize, DataTypes) => {
    const Shop = sequelize.define('Shop', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name_shop: {
            type: DataTypes.STRING,
            allowNull: false
        },
        avatar_shop: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        background_shop: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        address_shop: {
            type: DataTypes.STRING,
            allowNull: true
        },
        user_follow: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        start_time: {
            type: DataTypes.DATE,
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                isIn: [[0, 1, 2]] // 0: deleted, 1: active, 2: on hold
            }
        },
        topic: {
            type: DataTypes.STRING,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        }
    }, {
        tableName: 'Shops',
        timestamps: true
    });

    Shop.associate = function (models) {
        Shop.hasMany(models.ShopProduct, { foreignKey: 'shop_id' });
        Shop.hasMany(models.ShopUser, { foreignKey: 'shop_id' });
    };

    return Shop;
};
