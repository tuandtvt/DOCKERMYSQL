'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ShopUsers', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      shop_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Shops',
          key: 'id',
        },
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'user',
          key: 'id',
        },
        allowNull: false,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ShopUsers');
  },
};
