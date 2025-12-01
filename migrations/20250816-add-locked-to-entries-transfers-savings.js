'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check and add locked column to Entries
    const entriesTable = await queryInterface.describeTable('Entries');
    if (!entriesTable.locked) {
      await queryInterface.addColumn('Entries', 'locked', { 
        type: Sequelize.BOOLEAN, 
        defaultValue: false,
        allowNull: false
      });
    }
    
    // Check and add locked column to Transfers
    const transfersTable = await queryInterface.describeTable('Transfers');
    if (!transfersTable.locked) {
      await queryInterface.addColumn('Transfers', 'locked', { 
        type: Sequelize.BOOLEAN, 
        defaultValue: false,
        allowNull: false
      });
    }
    
    // Check and add locked column to Savings
    const savingsTable = await queryInterface.describeTable('Savings');
    if (!savingsTable.locked) {
      await queryInterface.addColumn('Savings', 'locked', { 
        type: Sequelize.BOOLEAN, 
        defaultValue: false,
        allowNull: false
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Entries', 'locked');
    await queryInterface.removeColumn('Transfers', 'locked');
    await queryInterface.removeColumn('Savings', 'locked');
  }
};