// migrations/20250814-create-entries.js
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Entries', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      amount: { type: Sequelize.DOUBLE, allowNull: false },
      currency: { type: Sequelize.STRING, allowNull: false },
      date: { type: Sequelize.DATE, allowNull: false },
      category: { type: '"enum_Entries_category"', allowNull: false },
      note: { type: Sequelize.STRING },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      typeId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Types', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Entries');
  }
};