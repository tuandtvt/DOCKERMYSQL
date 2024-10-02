'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Shops', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name_shop: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      avatar_shop: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      background_shop: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address_shop: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      user_follow: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      start_time: {
        type: Sequelize.DATE,
        allowNull: true,
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
      topic: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Shops');
  },
};
