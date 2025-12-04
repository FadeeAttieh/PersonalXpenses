const { Savings, User } = require('../models');
const { Op } = require('sequelize');

exports.createSavings = async (req, res, next) => {
  try {
    const { amount, currency, date, note } = req.body;
    const userId = req.user.id;
    // Only allow if no savings exists for this user/currency
    const existing = await Savings.findOne({ where: { userId, currency } });
    if (existing) {
      return res.status(400).json({ error: 'Initial savings already set for this currency.' });
    }
    
    try {
      const savings = await Savings.create({ amount, currency, date, note, userId });
      res.status(201).json(savings);
    } catch (createErr) {
      // Check if it's a unique constraint violation on id
      if (createErr.name === 'SequelizeUniqueConstraintError' || 
          (createErr.parent && createErr.parent.code === '23505')) {
        
        // Get the maximum ID from the table
        const maxSavings = await Savings.findOne({
          order: [['id', 'DESC']],
          attributes: ['id']
        });
        
        const maxId = maxSavings ? maxSavings.id : 0;
        const newId = maxId + 1;
        
        // Update the sequence to the correct value
        await Savings.sequelize.query(
          `SELECT setval(pg_get_serial_sequence('"Savings"', 'id'), ${newId}, false);`
        );
        
        // Retry creating the savings
        const savings = await Savings.create({ amount, currency, date, note, userId });
        res.status(201).json(savings);
      } else {
        throw createErr;
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }

};

exports.getAllSavings = async (req, res, next) => {
  try {
    console.log('getAllSavings called for user:', req.user && req.user.id);
    const userId = req.user.id;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0, 23, 59, 59);
    const savings = await Savings.findAll({
      where: {
        userId,
        date: { [Op.between]: [start, end] }
      }
    });
    res.json(savings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

exports.deleteSavings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    const deleted = await Savings.destroy({ where: { id, userId } });
    if (!deleted) return res.status(404).json({ error: 'Savings entry not found.' });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
  
};