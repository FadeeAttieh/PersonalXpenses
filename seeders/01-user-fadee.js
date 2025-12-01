'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPin = await bcrypt.hash('12345', 10);
    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        username: 'Fadee',
        pin: hashedPin,
        email: 'fadee@example.com',
        email_verified: true,
        email_verification_code: null,
        createdAt: new Date('2025-06-01T00:00:00.000Z'),
        updatedAt: new Date('2025-06-01T00:00:00.000Z')
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', { id: 1 }, {});
  }
};