'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Orders', 'quantity');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Orders', 'quantity', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  }
};
