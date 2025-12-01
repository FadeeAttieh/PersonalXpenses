const { Entry, Balance, Type } = require('../models');
const { Op } = require('sequelize');
const { Transfer } = require('../models');
exports.monthlyReport = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { month, year, currency } = req.query;
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    // Entries for this month
    const entries = await Entry.findAll({
      where: {
        userId,
        currency,
        date: { [Op.between]: [start, end] }
      },
      include: [{ model: Type }]
    });

    // Initial balance for this user and currency
  // Get the balance record for the selected month
// Get the balance record for the selected month
const balance = await Balance.findOne({ where: { userId, currency, month: `${year}-${String(month).padStart(2, '0')}` } });
const broughtForward = balance && balance.initial_amount !== null ? Number(balance.initial_amount) : 0;
const initialBalance = balance && balance.amount !== null ? Number(balance.amount) : 0;

   
    // Calculate totals for this month
    let totalIncome = 0;
    let totalExpenses = 0;
    entries.forEach(entry => {
      if (entry.category === 'income') totalIncome += Number(entry.amount);
      else if (entry.category === 'expense') totalExpenses += Number(entry.amount);
    });

    //const net = totalIncome - totalExpenses;

    const { Savings } = require('../models'); // At the top if not already imported

    // Calculate transfer totals for this month (for display in Balance Overview)
// Incoming Transfers: Savings ➔ Balance
const incomingTransfers = await Transfer.sum('amount', {
  where: {
    userId,
    currency,
    from_account: 'Savings',
    to_account: 'Balance',
    date: { [Op.between]: [start, end] }
  }
}) || 0;

// Outgoing Transfers: Balance ➔ Savings
const outgoingTransfers = await Transfer.sum('amount', {
  where: {
    userId,
    currency,
    from_account: 'Balance',
    to_account: 'Savings',
    date: { [Op.between]: [start, end] }
  }
}) || 0;

// For Savings Overview, use the same transfer amounts (they're the same, just different perspective)
const incomingSavingsTransfers = outgoingTransfers; // Balance → Savings (incoming to savings)
const outgoingSavingsTransfers = incomingTransfers; // Savings → Balance (outgoing from savings)

// Calculate savings this month from Savings table (excludes transfers since they're counted separately)
const savingsThisMonth = await Savings.sum('amount', {
  where: {
    userId,
    currency,
    date: { [Op.between]: [start, end] },
    note: { [Op.not]: 'Transfer to savings' }, // Exclude transfer records
    [Op.and]: [
      { note: { [Op.not]: 'Transfer from savings' } }
    ]
  }
}) || 0;

// Calculate total savings for this month using ONLY Savings table
// This includes all savings records (manual saves + transfers)
const totalSavingsThisMonth = await Savings.sum('amount', {
  where: {
    userId,
    currency,
    date: { [Op.lte]: end }
  }
}) || 0;


// Calculate net as specified
const moneyOnHand = Number(initialBalance)
  + Number(totalIncome)
  - Number(totalExpenses)
  + Number(incomingTransfers)
  - Number(outgoingTransfers);
    
    // Now include these in your response:
    res.json({
      entries,
      initialBalance,
      broughtForward,
      totalIncome,
      totalExpenses,
      incomingTransfers,
      outgoingTransfers,
      net: moneyOnHand,
      savingsThisMonth,
      totalSavingsThisMonth,  // <-- corrected placement
      incomingSavingsTransfers,      // <-- add these two fields
      outgoingSavingsTransfers  
    });


  
  } catch (err) {
    if (!res.headersSent) next(err);
  }
};