const { Entry, Balance, Savings } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../models').sequelize;

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get current month date range
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

    // Get distinct currencies from user's entries
    const entryCurrencies = await Entry.findAll({
      where: { userId },
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('currency')), 'currency']],
      raw: true
    });
    
    const currencies = entryCurrencies.map(e => e.currency).filter(c => c);
    
    if (currencies.length === 0) {
      // No entries yet, return empty data
      return res.json({
        income: {},
        expenses: {},
        balances: {},
        savings: {},
        totals: { entries: 0 },
        counts: { income: 0, expenses: 0 }
      });
    }

    // Calculate income by currency for current month
    const incomeData = await Entry.findAll({
      where: {
        userId,
        category: 'income',
        currency: { [Op.in]: currencies },
        date: {
          [Op.between]: [startOfMonth, endOfMonth]
        }
      },
      attributes: [
        'currency',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      group: ['currency'],
      raw: true
    });

    // Calculate expenses by currency for current month
    const expensesData = await Entry.findAll({
      where: {
        userId,
        category: 'expense',
        currency: { [Op.in]: currencies },
        date: {
          [Op.between]: [startOfMonth, endOfMonth]
        }
      },
      attributes: [
        'currency',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      group: ['currency'],
      raw: true
    });

    // Get current balances by currency
    const balancesData = await Balance.findAll({
      where: { 
        userId,
        currency: { [Op.in]: currencies }
      },
      attributes: [
        'currency',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      group: ['currency'],
      raw: true
    });

    // Get total savings by currency
    const savingsData = await Savings.findAll({
      where: { 
        userId,
        currency: { [Op.in]: currencies }
      },
      attributes: [
        'currency',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      group: ['currency'],
      raw: true
    });

    // Get entry counts
    const totalEntries = await Entry.count({ where: { userId } });
    const incomeCount = await Entry.count({ where: { userId, category: 'income' } });
    const expenseCount = await Entry.count({ where: { userId, category: 'expense' } });

    // Format data as currency: amount objects
    const income = {};
    const expenses = {};
    const balances = {};
    const savings = {};

    // Initialize all user currencies with 0
    currencies.forEach(currency => {
      income[currency] = 0;
      expenses[currency] = 0;
      balances[currency] = 0;
      savings[currency] = 0;
    });

    // Fill in actual values
    incomeData.forEach(item => {
      income[item.currency] = parseFloat(item.total) || 0;
    });

    expensesData.forEach(item => {
      expenses[item.currency] = parseFloat(item.total) || 0;
    });

    balancesData.forEach(item => {
      balances[item.currency] = parseFloat(item.total) || 0;
    });

    savingsData.forEach(item => {
      savings[item.currency] = parseFloat(item.total) || 0;
    });

    res.json({
      income,
      expenses,
      balances,
      savings,
      totals: {
        entries: totalEntries
      },
      counts: {
        income: incomeCount,
        expenses: expenseCount
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Error fetching dashboard statistics' });
  }
};
