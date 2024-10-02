'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Orders', 'product_id');
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('Orders', 'product_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  }
};
