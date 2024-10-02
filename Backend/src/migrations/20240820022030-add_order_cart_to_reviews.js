'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Reviews', 'order_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Orders',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.addColumn('Reviews', 'cart_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Carts',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.addColumn('Reviews', 'cart_item_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'CartItems',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Reviews', 'order_id');
    await queryInterface.removeColumn('Reviews', 'cart_id');
    await queryInterface.removeColumn('Reviews', 'cart_item_id');
  }
};
