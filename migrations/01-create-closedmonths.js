'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ClosedMonths', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: Sequelize.INTEGER, allowNull: false },
      currency: { type: Sequelize.STRING, allowNull: false },
      month: { type: Sequelize.STRING, allowNull: false }, // 'YYYY-MM'
      closedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });
    await queryInterface.addConstraint('ClosedMonths', {
      fields: ['userId', 'currency', 'month'],
      type: 'unique',
      name: 'unique_user_currency_month'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ClosedMonths');
  }
};