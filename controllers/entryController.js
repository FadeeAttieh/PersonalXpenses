const { Entry, Type } = require('../models');
const { Op } = require('sequelize');

function getCurrentMonthRange() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0, 23, 59, 59);
  return [start, end];
}

exports.createEntry = async (req, res, next) => {
  try {
    const { amount, currency, date, note, typeId, category } = req.body;
    const userId = req.user.id;
    
    try {
      const entry = await Entry.create({ userId, amount, currency, date, note, typeId, category });
      res.status(201).json(entry);
    } catch (createErr) {
      // Check if it's a unique constraint violation on id
      if (createErr.name === 'SequelizeUniqueConstraintError' || 
          (createErr.parent && createErr.parent.code === '23505')) {
        
        // Get the maximum ID from the table
        const maxEntry = await Entry.findOne({
          order: [['id', 'DESC']],
          attributes: ['id']
        });
        
        const maxId = maxEntry ? maxEntry.id : 0;
        const newId = maxId + 1;
        
        // Update the sequence to the correct value
        await Entry.sequelize.query(
          `SELECT setval(pg_get_serial_sequence('"Entries"', 'id'), ${newId}, false);`
        );
        
        // Retry creating the entry
        const entry = await Entry.create({ userId, amount, currency, date, note, typeId, category });
        res.status(201).json(entry);
      } else {
        throw createErr;
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

exports.getEntries = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { category } = req.query; // 'income' or 'expense'
    const [start, end] = getCurrentMonthRange();
    const entries = await Entry.findAll({
      where: {
        userId,
        category,
        date: { [Op.between]: [start, end] }
      },
      include: [{ model: Type }],
      order: [['date', 'DESC'], ['id', 'DESC']] // <-- Add this line!
    });
    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

exports.deleteEntry = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    await Entry.destroy({ where: { id, userId } });
    res.json({ success: true });
  } catch (err) {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
}
   // next(err);
  
};