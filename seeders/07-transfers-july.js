'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Transfers', [
      {
        userId: 1,
        currency: 'USD',
        amount: 100,
        from_account: 'Savings',
        to_account: 'Balance',
        date: '2025-07-12',
        note: 'USD: Savings to Balance',
        locked: false,
        createdAt: new Date('2025-07-12T12:00:00.000Z'),
        updatedAt: new Date('2025-07-12T12:00:00.000Z')
      },
      {
        userId: 1,
        currency: 'USD',
        amount: 50,
        from_account: 'Balance',
        to_account: 'Savings',
        date: '2025-07-15',
        note: 'USD: Balance to Savings',
        locked: false,
        createdAt: new Date('2025-07-15T12:00:00.000Z'),
        updatedAt: new Date('2025-07-15T12:00:00.000Z')
      },
      {
        userId: 1,
        currency: 'LBP',
        amount: 200000,
        from_account: 'Savings',
        to_account: 'Balance',
        date: '2025-07-20',
        note: 'LBP: Savings to Balance',
        locked: false,
        createdAt: new Date('2025-07-20T12:00:00.000Z'),
        updatedAt: new Date('2025-07-20T12:00:00.000Z')
      },
      {
        userId: 1,
        currency: 'LBP',
        amount: 100000,
        from_account: 'Balance',
        to_account: 'Savings',
        date: '2025-07-22',
        note: 'LBP: Balance to Savings',
        locked: false,
        createdAt: new Date('2025-07-22T12:00:00.000Z'),
        updatedAt: new Date('2025-07-22T12:00:00.000Z')
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Transfers', {
      userId: 1,
      date: { [Sequelize.Op.between]: ['2025-07-01', '2025-07-31'] }
    }, {});
  }
};