'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if column exists before adding
    const tableDescription = await queryInterface.describeTable('Balances');
    if (!tableDescription.initial_amount) {
      await queryInterface.addColumn('Balances', 'initial_amount', {
        type: Sequelize.DECIMAL(18,2),
        allowNull: true
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Balances', 'initial_amount');
  }
};