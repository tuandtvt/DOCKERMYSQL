'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Permisions', 'permision_name', {
      type: Sequelize.STRING,
      allowNull: false
    });

    await queryInterface.changeColumn('Permisions', 'description', {
      type: Sequelize.STRING,
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Permisions', 'permision_name', {
      type: Sequelize.INTEGER,
      allowNull: false
    });

    await queryInterface.changeColumn('Permisions', 'description', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  }
};
