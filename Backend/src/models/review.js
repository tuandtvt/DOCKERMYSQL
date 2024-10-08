'use strict';

module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
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
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    cart_item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'CartItems',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    tableName: 'Reviews',
    timestamps: true
  });

  Review.associate = function (models) {
    Review.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Review.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
    Review.belongsTo(models.CartItem, { foreignKey: 'cart_item_id', as: 'cartItem' });
  };

  return Review;
};
