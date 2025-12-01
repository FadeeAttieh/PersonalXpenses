const express = require('express');
const router = express.Router();
const balanceController = require('../controllers/balanceController');
const validateJoi = require('../middleware/validateJoi');
const schemas = require('../validation/schemas');

const { ClosedMonth } = require('../models');
const authJwt = require('../middleware/authJwt'); // Add this at the top if not present



   


router.post('/', validateJoi(schemas.balance), balanceController.setBalance);
router.get('/', balanceController.getBalances);
router.post('/transfer', validateJoi(schemas.transferBalance), balanceController.transferBetweenBalanceAndSavings);
router.post('/close-month', authJwt, validateJoi(schemas.closeMonth), balanceController.closeMonth);
router.get('/needs-close', balanceController.isPreviousMonthNeedsClosing);
router.get('/closed-months', async (req, res) => {
  try {
    const userId = req.user.id;
    const { month } = req.query;
    const closed = await ClosedMonth.findAll({
      where: { userId, month },
      attributes: ['currency']
    });
    res.json({ closedCurrencies: closed.map(c => c.currency) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check closed months.' });
    console.error('closeMonth error:', err);
  }
});

module.exports = router;