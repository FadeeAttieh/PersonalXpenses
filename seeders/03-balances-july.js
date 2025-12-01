'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Balances', [
      {
        userId: 1,
        currency: 'USD',
        amount: 1000,
        month: '2025-07',
        createdAt: new Date('2025-07-31T23:59:59.000Z'),
        updatedAt: new Date('2025-07-31T23:59:59.000Z')
      },
      {
        userId: 1,
        currency: 'LBP',
        amount: 15000000,
        month: '2025-07',
        createdAt: new Date('2025-07-31T23:59:59.000Z'),
        updatedAt: new Date('2025-07-31T23:59:59.000Z')
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Balances', { userId: 1, month: '2025-07' }, {});
  }
};