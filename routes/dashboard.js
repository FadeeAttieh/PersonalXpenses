const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Get dashboard statistics grouped by currency
router.get('/stats', dashboardController.getDashboardStats);

module.exports = router;
