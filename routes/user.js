const express = require('express');
const router = express.Router();
const { UserCurrency, Entry, Balance, Savings, Transfer, ClosedMonth, MonthCloseAudit, Type } = require('../models');
const authJwt = require('../middleware/authJwt'); // Use your JWT authentication middleware

// Get user's currencies
router.get('/currencies', authJwt, async (req, res) => {
  try {
    const userId = req.user.id;
    const currencies = await UserCurrency.findAll({ 
      where: { userId },
      attributes: ['currencyCode', 'active']
    });
    res.json({ currencies });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

router.post('/currencies', authJwt, async (req, res) => {

try{
     const userId = req.user.id;
  const { currencies } = req.body;
  if (!Array.isArray(currencies) || currencies.length === 0 || currencies.length > 2) {
    return res.status(400).json({ error: 'Select 1 or 2 currencies.' });
  }
  // Remove previous selections
  await UserCurrency.destroy({ where: { userId } });
  // Add new selections
  await Promise.all(currencies.map(code =>
    UserCurrency.create({ userId, currencyCode: code, active: true })
  ));
  res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Reset database - delete all transaction data but keep types and currencies
router.post('/reset-database', authJwt, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Delete all user data (preserve Types and Currencies which are shared)
    const deletedEntries = await Entry.destroy({ where: { userId } });
    const deletedBalances = await Balance.destroy({ where: { userId } });
    const deletedSavings = await Savings.destroy({ where: { userId } });
    const deletedTransfers = await Transfer.destroy({ where: { userId } });
    const deletedClosedMonths = await ClosedMonth.destroy({ where: { userId } });
    const deletedAudits = await MonthCloseAudit.destroy({ where: { userId } });
    const deletedUserCurrencies = await UserCurrency.destroy({ where: { userId } });
    
    res.json({ 
      success: true,
      message: 'Database reset successfully',
      deletedCounts: {
        entries: deletedEntries,
        balances: deletedBalances,
        savings: deletedSavings,
        transfers: deletedTransfers,
        closedMonths: deletedClosedMonths,
        audits: deletedAudits,
        userCurrencies: deletedUserCurrencies
      }
    });
  } catch (err) {
    console.error('Reset database error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Backup database - export all user data as JSON
router.get('/backup', authJwt, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Fetch all user data
    const entries = await Entry.findAll({ where: { userId }, raw: true });
    const balances = await Balance.findAll({ where: { userId }, raw: true });
    const savings = await Savings.findAll({ where: { userId }, raw: true });
    const transfers = await Transfer.findAll({ where: { userId }, raw: true });
    const closedMonths = await ClosedMonth.findAll({ where: { userId }, raw: true });
    const audits = await MonthCloseAudit.findAll({ where: { userId }, raw: true });
    const userCurrencies = await UserCurrency.findAll({ where: { userId }, raw: true });
    const types = await Type.findAll({ where: { userId }, raw: true });
    
    const backup = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      userId: userId,
      data: {
        entries,
        balances,
        savings,
        transfers,
        closedMonths,
        audits,
        userCurrencies,
        types
      }
    };
    
    res.json(backup);
  } catch (err) {
    console.error('Backup error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Restore database - import user data from JSON
router.post('/restore', authJwt, async (req, res) => {
  try {
    const userId = req.user.id;
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ error: 'No backup data provided' });
    }
    
    // First delete existing data
    await Entry.destroy({ where: { userId } });
    await Balance.destroy({ where: { userId } });
    await Savings.destroy({ where: { userId } });
    await Transfer.destroy({ where: { userId } });
    await ClosedMonth.destroy({ where: { userId } });
    await MonthCloseAudit.destroy({ where: { userId } });
    await UserCurrency.destroy({ where: { userId } });
    await Type.destroy({ where: { userId } });
    
    // Restore data with userId override for security
    const restoreCounts = {};
    
    if (data.types && Array.isArray(data.types)) {
      const typesData = data.types.map(t => ({ ...t, userId }));
      await Type.bulkCreate(typesData);
      restoreCounts.types = typesData.length;
    }
    
    if (data.userCurrencies && Array.isArray(data.userCurrencies)) {
      const currData = data.userCurrencies.map(c => ({ ...c, userId }));
      await UserCurrency.bulkCreate(currData);
      restoreCounts.userCurrencies = currData.length;
    }
    
    if (data.balances && Array.isArray(data.balances)) {
      const balData = data.balances.map(b => ({ ...b, userId }));
      await Balance.bulkCreate(balData);
      restoreCounts.balances = balData.length;
    }
    
    if (data.entries && Array.isArray(data.entries)) {
      const entryData = data.entries.map(e => ({ ...e, userId }));
      await Entry.bulkCreate(entryData);
      restoreCounts.entries = entryData.length;
    }
    
    if (data.savings && Array.isArray(data.savings)) {
      const savData = data.savings.map(s => ({ ...s, userId }));
      await Savings.bulkCreate(savData);
      restoreCounts.savings = savData.length;
    }
    
    if (data.transfers && Array.isArray(data.transfers)) {
      const transData = data.transfers.map(t => ({ ...t, userId }));
      await Transfer.bulkCreate(transData);
      restoreCounts.transfers = transData.length;
    }
    
    if (data.closedMonths && Array.isArray(data.closedMonths)) {
      const cmData = data.closedMonths.map(c => ({ ...c, userId }));
      await ClosedMonth.bulkCreate(cmData);
      restoreCounts.closedMonths = cmData.length;
    }
    
    if (data.audits && Array.isArray(data.audits)) {
      const auditData = data.audits.map(a => ({ ...a, userId }));
      await MonthCloseAudit.bulkCreate(auditData);
      restoreCounts.audits = auditData.length;
    }
    
    res.json({ 
      success: true,
      message: 'Database restored successfully',
      restoreCounts
    });
  } catch (err) {
    console.error('Restore error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

module.exports = router;