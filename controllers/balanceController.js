const { Balance, Entry, Expense, Income, Savings, Transfer, Type, ClosedMonth, User } = require('../models');
const { Op } = require('sequelize');
const { MonthCloseAudit } = require('../models');


function getPreviousMonthStr() {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth(); // 0-based, so this is previous month
  if (month === 0) { // January
    month = 12;
    year -= 1;
  }
  return `${year}-${String(month).padStart(2,'0')}`;
}

function getCurrentMonthStr() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
}

exports.setBalance = async (req, res, next) => {
  try {
    const { currency, amount } = req.body;
    const userId = req.user.id;
    const existing = await Balance.findOne({ where: { userId, currency } });
    if (existing) {
      return res.status(400).json({ error: 'Initial balance already set for this currency.' });
    }
    const month = req.body.month || getCurrentMonthStr();
    
    try {
      // Set initial_amount = amount for the first month
      const balance = await Balance.create({ userId, currency, amount, initial_amount: amount, month });
      res.status(201).json(balance);
    } catch (createErr) {
      // Check if it's a unique constraint violation on id
      if (createErr.name === 'SequelizeUniqueConstraintError' || 
          (createErr.parent && createErr.parent.code === '23505')) {
        
        // Get the maximum ID from the table
        const maxBalance = await Balance.findOne({
          order: [['id', 'DESC']],
          attributes: ['id']
        });
        
        const maxId = maxBalance ? maxBalance.id : 0;
        const newId = maxId + 1;
        
        // Update the sequence to the correct value
        await Balance.sequelize.query(
          `SELECT setval(pg_get_serial_sequence('"Balances"', 'id'), ${newId}, false);`
        );
        
        // Retry creating the balance
        const balance = await Balance.create({ userId, currency, amount, initial_amount: amount, month });
        res.status(201).json(balance);
      } else {
        throw createErr;
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

exports.closeMonth = async (req, res) => {
  try {

    console.log('--- CLOSE MONTH START ---');
    console.log('User:', req.user && req.user.id);
    console.log('Request body:', req.body);
 // --- Add these validation checks at the top ---
 if (!req.user || !req.user.id) {
  console.log('No user found');
  return res.status(401).json({ error: 'Unauthorized: No user found' });
}
if (!req.body.month || !Array.isArray(req.body.balances)) {
  console.log('Missing month or balances');
  return res.status(400).json({ error: 'Missing month or balances' });
}
// --- End validation checks ---

    const userId = req.user.id;
    const { month, balances } = req.body;
    console.log('Month:', month);
    console.log('Balances array:', balances);
    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    // Use current date/time as the closing point instead of end of month
    const endDate = new Date();
    console.log('Start date:', startDate, 'End date (NOW):', endDate);


    for (const b of balances) {
     
      console.log('Processing balance object:', b);
      if (!b.currency || b.moneyOnHand == null || b.savings == null) {
        console.log('Invalid balance object:', b);
        return res.status(400).json({ error: 'Each balance must have currency, moneyOnHand, and savings.' });
      }
 
    
      const { currency, moneyOnHand, savings } = b;
      console.log(`Currency: ${currency}, MoneyOnHand: ${moneyOnHand}, Savings: ${savings}`);

      // Get the starting balance for this month (initial_amount)
      const currentBalance = await Balance.findOne({
        where: { userId, currency, month }
      });
      const initialAmount = currentBalance ? Number(currentBalance.initial_amount || 0) : 0;
      console.log('Initial amount at start of month:', initialAmount);

      // Calculate audit values BEFORE locking (only count unlocked records)
      const incomeSum = await Entry.sum('amount', {
        where: { 
          userId, 
          currency, 
          category: 'income', 
          date: { [Op.between]: [startDate, endDate] },
          locked: { [Op.or]: [false, null] }  // Only unlocked records
        }
      }) || 0;
      const expenseSum = await Entry.sum('amount', {
        where: { 
          userId, 
          currency, 
          category: 'expense', 
          date: { [Op.between]: [startDate, endDate] },
          locked: { [Op.or]: [false, null] }  // Only unlocked records
        }
      }) || 0;
      const incomingTransfers = await Transfer.sum('amount', {
        where: { 
          userId, 
          currency, 
          from_account: 'Savings', 
          to_account: 'Balance', 
          date: { [Op.between]: [startDate, endDate] },
          locked: { [Op.or]: [false, null] }  // Only unlocked records
        }
      }) || 0;
      const outgoingTransfers = await Transfer.sum('amount', {
        where: { 
          userId, 
          currency, 
          from_account: 'Balance', 
          to_account: 'Savings', 
          date: { [Op.between]: [startDate, endDate] },
          locked: { [Op.or]: [false, null] }  // Only unlocked records
        }
      }) || 0;
      console.log('Unlocked transactions - incomeSum:', incomeSum, 'expenseSum:', expenseSum, 'incomingTransfers:', incomingTransfers, 'outgoingTransfers:', outgoingTransfers);

      // Now lock all records for this month
      console.log('Attempting to lock records with:', { userId, currency, startDate, endDate });
      
      const entryUpdate = await Entry.update(
        { locked: true },
        { where: { userId, currency, date: { [Op.between]: [startDate, endDate] } } }
      );
      console.log('Entry update result (rows affected):', entryUpdate[0]);
      
      const transferUpdate = await Transfer.update(
        { locked: true },
        { where: { userId, currency, date: { [Op.between]: [startDate, endDate] } } }
      );
      console.log('Transfer update result (rows affected):', transferUpdate[0]);
      
      // For Savings (DATEONLY), format dates as YYYY-MM-DD
      const startDateOnly = startDate.toISOString().split('T')[0];
      const endDateOnly = endDate.toISOString().split('T')[0];
      
      const savingsUpdate = await Savings.update(
        { locked: true },
        { where: { userId, currency, date: { [Op.between]: [startDateOnly, endDateOnly] } } }
      );
      console.log('Savings update result (rows affected):', savingsUpdate[0]);
      try {
        const savingsRecord = await Savings.create({
          userId,
          currency,
          amount: savings,
          date: endDateOnly,
          note: `Auto-saved for ${month}`,
          locked: true
        });
        console.log('Savings snapshot created:', savingsRecord && savingsRecord.id);
      } catch (err) {
        console.error('Error creating savings record:', err);
        return res.status(500).json({ error: 'Failed to create savings record' });
      }

      // FIXED: Calculate based on STARTING balance (initial_amount), not ending balance (moneyOnHand)
      const calculatedMoneyOnHand =
      Number(initialAmount) +
      Number(incomeSum) -
      Number(expenseSum) +
      Number(incomingTransfers) -
      Number(outgoingTransfers);

      console.log('calculatedMoneyOnHand (based on initial_amount):', calculatedMoneyOnHand);

      // Calculate total savings (excluding the auto-saved snapshot we just created, and only unlocked)
      const calculatedSavings = await Savings.sum('amount', {
        where: { 
          userId, 
          currency, 
          date: { [Op.between]: [startDateOnly, endDateOnly] },
          locked: { [Op.or]: [false, null] },  // Only unlocked records
          note: { [Op.not]: `Auto-saved for ${month}` }  // Exclude the snapshot we just created
        }
      }) || 0;
      console.log('calculatedSavings:', calculatedSavings);

   
     try {

// filepath: /Users/admin/Documents/My_Apps/My_Expenses_App/controllers/balanceController.js
console.log('MonthCloseAudit.create payload:', {
  userId,
  currency,
  month,
  calculated_money_on_hand: String(calculatedMoneyOnHand),
  entered_money_on_hand: String(moneyOnHand),
  calculated_savings: String(calculatedSavings),
  entered_savings: String(savings),
  difference_money_on_hand: String(Number(moneyOnHand) - Number(calculatedMoneyOnHand)),
  difference_savings: String(Number(savings) - Number(calculatedSavings)),
  closed_at: new Date(),
  note: null
});

const auditRecord = await MonthCloseAudit.create({
  userId,
  currency,
  month,
  calculated_money_on_hand: String(calculatedMoneyOnHand),
  entered_money_on_hand: String(moneyOnHand),
  calculated_savings: String(calculatedSavings),
  entered_savings: String(savings),
  difference_money_on_hand: String(Number(moneyOnHand) - Number(calculatedMoneyOnHand)),
  difference_savings: String(Number(savings) - Number(calculatedSavings)),
  closed_at: new Date(),
  note: null
});
console.log('MonthCloseAudit record created:', auditRecord && auditRecord.id);

     } catch (err) {
       console.error('Error creating MonthCloseAudit record:', err);
       return res.status(500).json({ error: 'Failed to create MonthCloseAudit record' });
     }

     try {
      const balanceUpsert = await Balance.upsert(
        {
          userId,
          currency,
          amount: moneyOnHand,
          month
        },
        {
          conflictFields: ['userId', 'currency', 'month']
        }
      );
      console.log('Balance upsert result:', balanceUpsert);

      } catch (err) {
        console.error('Error updating Balance record:', err);
        return res.status(500).json({ error: 'Failed to update Balance record' });
      }

      try {

        await ClosedMonth.upsert({
          userId,
          currency,
          month,
          closedAt: new Date()
        });
      } catch (err) {
        console.error('Error updating ClosedMonth record:', err);
        return res.status(500).json({ error: 'Failed to update ClosedMonth record' });
      }

      // After upserting the current month's balance
      const nextMonthNum = monthNum === 12 ? 1 : monthNum + 1;
      const nextYear = monthNum === 12 ? year + 1 : year;
      const nextMonthStr = `${nextYear}-${String(nextMonthNum).padStart(2, '0')}`;
      await Balance.upsert(
        {
          userId,
          currency,
          month: nextMonthStr,
          initial_amount: moneyOnHand, // Set brought forward for next month
          amount: moneyOnHand          // Set amount to same value for next month
        },
        {
          conflictFields: ['userId', 'currency', 'month']
        }
      );
    }
    console.log('Month closed successfully');
    res.status(200).json({ message: 'Month closed for all currencies.' });
  } catch (err) {
    console.error('closeMonth error:', err);
    console.error('Error stack:', err.stack);
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    res.status(500).json({ error: err.message || 'Internal server error', details: err.stack });
  }
};

exports.getBalances = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const userId = req.user.id;
    const month = req.query.month || getCurrentMonthStr();
    const balances = await Balance.findAll({ where: { userId, month } });

    const result = [];
    for (const bal of balances) {
      const currency = bal.currency;
      const [year, monthNum] = month.split('-').map(Number);
      const start = new Date(year, monthNum - 1, 1);
      const end = new Date(year, monthNum, 0, 23, 59, 59);

      const incomeSum = await Entry.sum('amount', {
        where: { userId, currency, category: 'income', date: { [Op.between]: [start, end] } }
      }) || 0;

      const expenseSum = await Entry.sum('amount', {
        where: { userId, currency, category: 'expense', date: { [Op.between]: [start, end] } }
      }) || 0;

      const incomingTransfers = await Transfer.sum('amount', {
        where: { userId, currency, from_account: 'Savings', to_account: 'Balance', date: { [Op.between]: [start, end] } }
      }) || 0;
      
      const outgoingTransfers = await Transfer.sum('amount', {
        where: { userId, currency, from_account: 'Balance', to_account: 'Savings', date: { [Op.between]: [start, end] } }
      }) || 0;

// Calculate total savings using ONLY the Savings table
// Since transfers now create Savings records (positive for incoming, negative for outgoing),
// we just need to sum all Savings records up to the end of this month
const totalSavingsThisMonth = await Savings.sum('amount', {
  where: { 
    userId, 
    currency, 
    date: { [Op.lte]: end } // All savings up to end of this month
  }
}) || 0;

// Money on hand formula - use initial_amount as starting point
const moneyOnHand = 
  Number(bal.initial_amount || 0) +
  Number(incomeSum) -
  Number(expenseSum) +
  Number(incomingTransfers) -
  Number(outgoingTransfers);

result.push({
  currency,
  moneyOnHand: Number(moneyOnHand.toFixed(2)),
  savings: Number(totalSavingsThisMonth),
  initialBalance: Number(bal.initial_amount || 0),
  closingBalance: Number(bal.amount || 0),
  incomeSum: Number(incomeSum),
  expenseSum: Number(expenseSum),
  incomingTransfers: Number(incomingTransfers),
  outgoingTransfers: Number(outgoingTransfers)
});
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

exports.transferBetweenBalanceAndSavings = async (req, res, next) => {
  try {
    const { from, to, amount, currency } = req.body;
    const userId = req.user.id;
    const amt = parseFloat(amount);

    if (from === to) return res.status(400).json({ error: 'Source and destination must differ.' });

    const balance = await Balance.findOne({ where: { userId, currency } });
    if (!balance) return res.status(400).json({ error: 'Balance not found.' });

    const savings = await require('../models').Savings.findOne({ where: { userId, currency } });
    if (!savings) return res.status(400).json({ error: 'Savings not found.' });

    if (from === 'balance' && to === 'savings') {
      if (balance.amount < amt) return res.status(400).json({ error: 'Insufficient balance.' });
      balance.amount -= amt;
      savings.amount += amt;
    } else if (from === 'savings' && to === 'balance') {
      if (savings.amount < amt) return res.status(400).json({ error: 'Insufficient savings.' });
      savings.amount -= amt;
      balance.amount += amt;
    } else {
      return res.status(400).json({ error: 'Invalid transfer direction.' });
    }

    await balance.save();
    await savings.save();

    res.json({ balance, savings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

exports.isPreviousMonthNeedsClosing = async (req, res) => {
  try {
    const userId = req.user.id;
    const prevMonth = getPreviousMonthStr();
    const [year, monthNum] = prevMonth.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59);

    const entryCount = await Entry.count({ where: { userId, date: { [Op.between]: [startDate, endDate] } } });
    const savingsCount = await Savings.count({ where: { userId, date: { [Op.between]: [startDate, endDate] } } });
    const transferCount = await Transfer.count({ where: { userId, date: { [Op.between]: [startDate, endDate] } } });

    if (entryCount === 0 && savingsCount === 0 && transferCount === 0) {
      return res.json({ needsClosing: false });
    }

    const closed = await ClosedMonth.findAll({ where: { userId, month: prevMonth } });
    if (closed && closed.length > 0) {
      return res.json({ needsClosing: false });
    }

    return res.json({ needsClosing: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check previous month status.' });
    console.error('closeMonth error:', err);
  }
};