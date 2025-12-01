'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MonthCloseAudits', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      userId: { type: Sequelize.INTEGER, allowNull: false },
      currency: { type: Sequelize.STRING, allowNull: false },
      month: { type: Sequelize.STRING, allowNull: false },
      calculated_money_on_hand: { type: Sequelize.DECIMAL(18,2), allowNull: false },
      entered_money_on_hand: { type: Sequelize.DECIMAL(18,2), allowNull: false },
      calculated_savings: { type: Sequelize.DECIMAL(18,2), allowNull: false },
      entered_savings: { type: Sequelize.DECIMAL(18,2), allowNull: false },
      difference_money_on_hand: { type: Sequelize.DECIMAL(18,2), allowNull: false },
      difference_savings: { type: Sequelize.DECIMAL(18,2), allowNull: false },
      closed_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      note: { type: Sequelize.STRING }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('MonthCloseAudits');
  }
};