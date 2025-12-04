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

    // Helper function to create with retry on ID conflict
    const createWithRetry = async (Model, data, tableName) => {
      try {
        return await Model.create(data);
      } catch (createErr) {
        if (createErr.name === 'SequelizeUniqueConstraintError' || 
            (createErr.parent && createErr.parent.code === '23505')) {
          
          const maxRecord = await Model.findOne({
            order: [['id', 'DESC']],
            attributes: ['id']
          });
          
          const maxId = maxRecord ? maxRecord.id : 0;
          const newId = maxId + 1;
          
          await Model.sequelize.query(
            `SELECT setval(pg_get_serial_sequence('"${tableName}"', 'id'), ${newId}, false);`
          );
          
          return await Model.create(data);
        } else {
          throw createErr;
        }
      }
    };

    // Create transfer record with normalized names
    const transfer = await createWithRetry(Transfer, {
      from_account: fromAccount, 
      to_account: toAccount, 
      amount: amt, 
      currency, 
      date, 
      note, 
      userId
    }, 'Transfers');

    // Update Savings table based on transfer direction
    if (fromAccount === 'Balance' && toAccount === 'Savings') {
      // Transfer TO savings - create positive Savings record
      await createWithRetry(Savings, {
        userId,
        currency,
        amount: amt,
        date,
        note: note || 'Transfer to savings'
      }, 'Savings');

    } else if (fromAccount === 'Savings' && toAccount === 'Balance') {
      // Transfer FROM savings - create negative Savings record
      await createWithRetry(Savings, {
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