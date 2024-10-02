module.exports = (sequelize, DataTypes) => {
    const ShopUser = sequelize.define('ShopUser', {
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
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                isIn: [[0, 1]]
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
        tableName: 'ShopUsers',
        timestamps: true
    });

    ShopUser.associate = function (models) {
        ShopUser.belongsTo(models.Shop, { foreignKey: 'shop_id', as: 'Shop' });
        ShopUser.belongsTo(models.User, { foreignKey: 'user_id', as: 'User' });
    };

    return ShopUser;
};
