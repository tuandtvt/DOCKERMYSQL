'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('CartItems', 'discount', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0
    });
    await queryInterface.addColumn('CartItems', 'gift', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('CartItems', 'discount');
    await queryInterface.removeColumn('CartItems', 'gift');
  }
};
