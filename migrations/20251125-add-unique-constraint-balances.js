'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if constraint already exists
    const constraints = await queryInterface.sequelize.query(`
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_name = 'Balances' 
      AND constraint_name = 'unique_user_currency_month_balance';
    `, { type: queryInterface.sequelize.QueryTypes.SELECT });
    
    if (constraints.length > 0) {
      console.log('Constraint unique_user_currency_month_balance already exists, skipping...');
      return;
    }
    
    // First, remove any duplicate rows (keep the most recent one)
    await queryInterface.sequelize.query(`
      DELETE FROM "Balances" a USING "Balances" b
      WHERE a.id < b.id 
      AND a."userId" = b."userId" 
      AND a.currency = b.currency 
      AND a.month = b.month;
    `);
    
    // Add the unique constraint
    await queryInterface.addConstraint('Balances', {
      fields: ['userId', 'currency', 'month'],
      type: 'unique',
      name: 'unique_user_currency_month_balance'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Balances', 'unique_user_currency_month_balance');
  }
};
