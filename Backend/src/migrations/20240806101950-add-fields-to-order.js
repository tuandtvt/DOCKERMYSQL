'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Orders', 'tax', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0
    });
    await queryInterface.addColumn('Orders', 'delivery_date', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('Orders', 'cart_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Carts',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Orders', 'tax');
    await queryInterface.removeColumn('Orders', 'delivery_date');
    await queryInterface.removeColumn('Orders', 'cart_id');
  }
};
