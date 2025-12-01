const { Transfer, Balance, Savings } = require('../models');

exports.createTransfer = async (req, res, next) => {
  try {
    let { from_account, to_account, amount, currency, date, note } = req.body;
    const userId = req.user.id;
    const amt = parseFloat(amount);

    // Normalize account names to match balance controller expectations
    // Frontend sends: 'money_on_hand', 'savings'
    // We need to store: 'Balance', 'Savings' to match balance controller queries
    const normalizeAccount = (account) => {
      if (account === 'money_on_hand') return 'Balance';
      if (account === 'savings') return 'Savings';
      return account;
    };

    const fromAccount = normalizeAccount(from_account);
    const toAccount = normalizeAccount(to_account);

    // Create transfer record with normalized names
    const transfer = await Transfer.create({
      from_account: fromAccount, 
      to_account: toAccount, 
      amount: amt, 
      currency, 
      date, 
      note, 
      userId
    });

    // Update Savings table based on transfer direction
    if (fromAccount === 'Balance' && toAccount === 'Savings') {
      // Transfer TO savings - create positive Savings record
      await Savings.create({
        userId,
        currency,
        amount: amt,
        date,
        note: note || 'Transfer to savings'
      });

    } else if (fromAccount === 'Savings' && toAccount === 'Balance') {
      // Transfer FROM savings - create negative Savings record
      await Savings.create({
        userId,
        currency,
        amount: -amt,
        date,
        note: note || 'Transfer from savings'
      });
    }

    res.status(201).json(transfer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }

};
exports.getAllTransfers = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 30;
    const offset = parseInt(req.query.offset) || 0;
    const transfers = await Transfer.findAll({
      where: { userId },
      order: [['date', 'DESC']],
      limit,
      offset
    });
    res.json(transfers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

exports.deleteTransfer = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    const deleted = await Transfer.destroy({ where: { id, userId } });
    if (!deleted) return res.status(404).json({ error: 'Transfer not found.' });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }

};