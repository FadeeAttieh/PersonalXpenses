const express = require('express');
const router = express.Router();
const entryController = require('../controllers/entryController');
const validateJoi = require('../middleware/validateJoi');
const schemas = require('../validation/schemas');
const validateInput = require('../middleware/validateJoi');
const verifyToken = require('../middleware/authJwt');
//const validateInput = require('../middleware/ValidateInput');

router.post('/', verifyToken, validateJoi(schemas.entry), entryController.createEntry);
router.get('/', verifyToken, entryController.getEntries);
router.delete('/:id', verifyToken, entryController.deleteEntry);

module.exports = router;