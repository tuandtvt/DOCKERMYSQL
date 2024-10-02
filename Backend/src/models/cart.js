'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
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
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0 
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
    tableName: 'Carts',
    timestamps: true
  });

  Cart.associate = function(models) {
    Cart.belongsTo(models.User, { foreignKey: 'user_id', as: 'User' });
    Cart.hasMany(models.CartItem, { foreignKey: 'cart_id', as: 'CartItems' });
  };

  return Cart;
};
