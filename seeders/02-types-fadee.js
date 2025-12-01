'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Types', [
      { id: 1, name: 'SALARY', category: 'income', userId: 1, createdAt: new Date('2025-07-17T09:53:48.401Z'), updatedAt: new Date('2025-07-17T09:53:48.401Z'), description: null },
      { id: 2, name: 'EDL', category: 'expense', userId: 1, createdAt: new Date('2025-07-17T09:53:59.675Z'), updatedAt: new Date('2025-07-17T09:53:59.675Z'), description: null },
      { id: 3, name: 'HOUSE RENT', category: 'expense', userId: 1, createdAt: new Date('2025-07-17T09:54:11.017Z'), updatedAt: new Date('2025-07-17T09:54:11.017Z'), description: null },
      { id: 4, name: 'PRETTY WOMEN', category: 'income', userId: 1, createdAt: new Date('2025-07-17T18:18:05.031Z'), updatedAt: new Date('2025-07-17T18:18:05.031Z'), description: null },
      { id: 5, name: 'KIDZONE', category: 'income', userId: 1, createdAt: new Date('2025-07-17T18:18:11.546Z'), updatedAt: new Date('2025-07-17T18:18:11.546Z'), description: null },
      { id: 6, name: 'XXCLOZET', category: 'income', userId: 1, createdAt: new Date('2025-07-17T18:18:16.408Z'), updatedAt: new Date('2025-07-17T18:18:16.408Z'), description: null },
      { id: 7, name: 'GMEN', category: 'income', userId: 1, createdAt: new Date('2025-07-17T18:18:21.104Z'), updatedAt: new Date('2025-07-17T18:18:21.104Z'), description: null },
      { id: 8, name: 'WRTW', category: 'income', userId: 1, createdAt: new Date('2025-07-17T18:18:29.447Z'), updatedAt: new Date('2025-07-17T18:18:29.447Z'), description: null },
      { id: 9, name: 'INTERNET_GENERATOR', category: 'expense', userId: 1, createdAt: new Date('2025-07-17T18:19:04.185Z'), updatedAt: new Date('2025-07-17T18:19:04.185Z'), description: null },
      { id: 10, name: 'SUPPLIERS', category: 'expense', userId: 1, createdAt: new Date('2025-07-17T18:19:15.279Z'), updatedAt: new Date('2025-07-17T18:19:15.279Z'), description: null },
      { id: 11, name: 'SUPERMARKET', category: 'expense', userId: 1, createdAt: new Date('2025-07-17T18:19:20.341Z'), updatedAt: new Date('2025-07-17T18:19:20.341Z'), description: null },
      { id: 12, name: 'MISC(EXPENSE)', category: 'expense', userId: 1, createdAt: new Date('2025-07-17T18:19:47.664Z'), updatedAt: new Date('2025-07-17T18:19:47.664Z'), description: null },
      { id: 13, name: 'MISC(INCOME)', category: 'income', userId: 1, createdAt: new Date('2025-07-17T09:53:52.278Z'), updatedAt: new Date('2025-07-17T09:53:52.278Z'), description: null },
      { id: 14, name: 'FUEL', category: 'expense', userId: 1, createdAt: new Date('2025-07-17T18:20:26.903Z'), updatedAt: new Date('2025-07-17T18:20:26.903Z'), description: null },
      { id: 15, name: 'MECANICIEN', category: 'expense', userId: 1, createdAt: new Date('2025-07-17T18:20:33.281Z'), updatedAt: new Date('2025-07-17T18:20:33.281Z'), description: null }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Types', { userId: 1 }, {});
  }
};