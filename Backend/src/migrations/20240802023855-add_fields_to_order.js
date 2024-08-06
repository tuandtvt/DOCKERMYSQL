'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Orders', 'discount', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn('Orders', 'shipping_cost', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn('Orders', 'tax', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn('Orders', 'gift', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Orders', 'delivery_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('Orders', 'order_status', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'pending',
    });
    await queryInterface.addColumn('Orders', 'payment_method', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Orders', 'discount');
    await queryInterface.removeColumn('Orders', 'shipping_cost');
    await queryInterface.removeColumn('Orders', 'tax');
    await queryInterface.removeColumn('Orders', 'gift');
    await queryInterface.removeColumn('Orders', 'delivery_date');
    await queryInterface.removeColumn('Orders', 'order_status');
    await queryInterface.removeColumn('Orders', 'payment_method');
  }
};
