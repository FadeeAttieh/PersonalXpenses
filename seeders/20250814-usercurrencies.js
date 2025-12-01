'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('UserCurrencies', [
      {
        userId: 1,
        currencyCode: 'USD',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        currencyCode: 'LBP',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('UserCurrencies', { userId: 1 }, {});
  }
};