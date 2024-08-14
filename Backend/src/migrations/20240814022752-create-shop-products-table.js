'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ShopProducts', {
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
      product_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Products',
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
    await queryInterface.dropTable('ShopProducts');
  },
};
