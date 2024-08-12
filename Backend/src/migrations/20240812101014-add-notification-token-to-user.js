module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user', 'notificationToken', {
      type: Sequelize.STRING(255),
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user', 'notificationToken');
  }
};
