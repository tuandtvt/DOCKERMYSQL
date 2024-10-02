'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Permisions', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'user',  
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Permisions', 'user_id');
  }
};
