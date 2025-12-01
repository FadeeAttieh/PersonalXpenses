'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if column exists before adding
    const tableDescription = await queryInterface.describeTable('Types');
    if (!tableDescription.description) {
      await queryInterface.addColumn('Types', 'description', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Types', 'description');
  }
};