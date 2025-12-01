const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transferController');
const validateJoi = require('../middleware/validateJoi');
const schemas = require('../validation/schemas');

router.post('/', validateJoi(schemas.transfer), transferController.createTransfer);
router.get('/', transferController.getAllTransfers);
router.delete('/:id', transferController.deleteTransfer);

module.exports = router;