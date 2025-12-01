'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserCurrencies', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      currencyCode: {
        type: Sequelize.STRING(10),
        allowNull: false,
        references: { model: 'Currencies', key: 'code' },
        onDelete: 'CASCADE'
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });
    await queryInterface.addConstraint('UserCurrencies', {
      fields: ['userId', 'currencyCode'],
      type: 'unique',
      name: 'unique_user_currency'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserCurrencies');
  }
};