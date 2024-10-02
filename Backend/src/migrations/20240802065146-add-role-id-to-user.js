'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Roles', 'role_name', {
      type: Sequelize.STRING,
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Roles', 'role_name', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  }
};
