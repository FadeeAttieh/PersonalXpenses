const express = require('express');
const router = express.Router();
const savingsController = require('../controllers/savingsController');
const validateJoi = require('../middleware/validateJoi');
const schemas = require('../validation/schemas');

router.post('/', validateJoi(schemas.savings), savingsController.createSavings);
router.get('/', savingsController.getAllSavings);
router.delete('/:id', savingsController.deleteSavings);

module.exports = router;