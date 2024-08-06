'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    total: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false
    },
    order_status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending'
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address_ship: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    delivery_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    cart_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Cart',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
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
    tableName: 'Orders',
    timestamps: true
  });

  Order.associate = function(models) {
    Order.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Order.belongsTo(models.Cart, { foreignKey: 'cart_id', as: 'cart' });
  };

  return Order;
};
