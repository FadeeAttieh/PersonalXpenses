'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Currencies', [
      { code: 'USD', name: 'US Dollar', createdAt: new Date(), updatedAt: new Date() },
      { code: 'LBP', name: 'Lebanese Pound', createdAt: new Date(), updatedAt: new Date() },
      { code: 'EUR', name: 'Euro', createdAt: new Date(), updatedAt: new Date() },
      { code: 'GBP', name: 'British Pound', createdAt: new Date(), updatedAt: new Date() },
      { code: 'CAD', name: 'Canadian Dollar', createdAt: new Date(), updatedAt: new Date() },
      { code: 'JPY', name: 'Japanese Yen', createdAt: new Date(), updatedAt: new Date() },
      { code: 'TRY', name: 'Turkish Lira', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Currencies', { code: ['USD', 'LBP', 'EUR', 'GBP', 'CAD', 'JPY', 'TRY'] }, {});
  }
};