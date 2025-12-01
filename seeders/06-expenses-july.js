'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Entries', [
      {
        userId: 1,
        currency: 'USD',
        amount: 100,
        category: 'expense',
        typeId: 2, // <-- replace with actual typeId for 'SUPERMARKET' if needed
        note: 'Groceries July USD',
        date: '2025-07-10',
        locked: false,
        createdAt: new Date('2025-07-10T12:00:00.000Z'),
        updatedAt: new Date('2025-07-10T12:00:00.000Z')
      },
      {
        userId: 1,
        currency: 'LBP',
        amount: 300000,
        category: 'expense',
        typeId: 2, // <-- replace with actual typeId for 'SUPERMARKET' if needed
        note: 'Groceries July LBP',
        date: '2025-07-10',
        locked: false,
        createdAt: new Date('2025-07-10T12:00:00.000Z'),
        updatedAt: new Date('2025-07-10T12:00:00.000Z')
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Entries', {
      userId: 1,
      category: 'expense',
      date: '2025-07-10'
    }, {});
  }
};