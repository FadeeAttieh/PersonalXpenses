'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Savings', [
      {
        userId: 1,
        currency: 'USD',
        amount: 200,
        note: 'July savings USD',
        date: '2025-07-15',
        locked: false,
        createdAt: new Date('2025-07-15T12:00:00.000Z'),
        updatedAt: new Date('2025-07-15T12:00:00.000Z')
      },
      {
        userId: 1,
        currency: 'LBP',
        amount: 500000,
        note: 'July savings LBP',
        date: '2025-07-15',
        locked: false,
        createdAt: new Date('2025-07-15T12:00:00.000Z'),
        updatedAt: new Date('2025-07-15T12:00:00.000Z')
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Savings', { userId: 1, date: '2025-07-15' }, {});
  }
};