'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Entries.amount
    await queryInterface.changeColumn('Entries', 'amount', {
      type: Sequelize.DECIMAL(18, 2),
      allowNull: false,
    });

    // Transfers.amount
    await queryInterface.changeColumn('Transfers', 'amount', {
      type: Sequelize.DECIMAL(18, 2),
      allowNull: false,
    });

    // Balances.amount
    await queryInterface.changeColumn('Balances', 'amount', {
      type: Sequelize.DECIMAL(18, 2),
      allowNull: false,
    });

    // Savings.amount
    await queryInterface.changeColumn('Savings', 'amount', {
      type: Sequelize.DECIMAL(18, 2),
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert to FLOAT (or previous type) if needed
    await queryInterface.changeColumn('Entries', 'amount', {
      type: Sequelize.FLOAT,
      allowNull: false,
    });

    await queryInterface.changeColumn('Transfers', 'amount', {
      type: Sequelize.FLOAT,
      allowNull: false,
    });

    await queryInterface.changeColumn('Balances', 'amount', {
      type: Sequelize.FLOAT,
      allowNull: false,
    });

    await queryInterface.changeColumn('Savings', 'amount', {
      type: Sequelize.FLOAT,
      allowNull: false,
    });
  }
};