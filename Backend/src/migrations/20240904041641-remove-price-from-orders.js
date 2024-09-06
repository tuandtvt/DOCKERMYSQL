'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('Orders', 'price');
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('Orders', 'price', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  }
};
