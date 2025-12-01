'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Entries', [
      {
        userId: 1,
        currency: 'USD',
        amount: 500,
        category: 'income',
        typeId: 1, // <-- replace with actual typeId for 'SALARY' if needed
        note: 'Salary July USD',
        date: '2025-07-05',
        locked: false,
        createdAt: new Date('2025-07-05T12:00:00.000Z'),
        updatedAt: new Date('2025-07-05T12:00:00.000Z')
      },
      {
        userId: 1,
        currency: 'LBP',
        amount: 2000000,
        category: 'income',
        typeId: 1, // <-- replace with actual typeId for 'SALARY' if needed
        note: 'Salary July LBP',
        date: '2025-07-05',
        locked: false,
        createdAt: new Date('2025-07-05T12:00:00.000Z'),
        updatedAt: new Date('2025-07-05T12:00:00.000Z')
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Entries', {
      userId: 1,
      category: 'income',
      date: '2025-07-05'
    }, {});
  }
};