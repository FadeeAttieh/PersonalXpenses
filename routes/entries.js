const express = require('express');
const router = express.Router();
const entryController = require('../controllers/entryController');
const validateJoi = require('../middleware/validateJoi');
const schemas = require('../validation/schemas');
const validateInput = require('../middleware/validateJoi');
//const validateInput = require('../middleware/ValidateInput');

router.post('/', validateJoi(schemas.entry), entryController.createEntry);
router.get('/', entryController.getEntries);
router.delete('/:id', entryController.deleteEntry);

module.exports = router;