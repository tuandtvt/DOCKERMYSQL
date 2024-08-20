'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Reviews', 'order_id');
    await queryInterface.removeColumn('Reviews', 'cart_id');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Reviews', 'order_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    await queryInterface.addColumn('Reviews', 'cart_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Carts',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }
};
