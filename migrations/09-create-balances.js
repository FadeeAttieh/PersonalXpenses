'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Balances', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
      currency: { type: Sequelize.STRING, allowNull: false },
      amount: { type: Sequelize.DECIMAL(18,2), allowNull: false },
      month: { type: Sequelize.STRING, allowNull: false }, // <-- Ensure this line is present
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });
    await queryInterface.addConstraint('Balances', {
      fields: ['userId', 'currency', 'month'],
      type: 'unique',
      name: 'unique_user_currency_month_balance'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Balances');
  }
};