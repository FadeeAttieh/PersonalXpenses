const express = require('express');
const router = express.Router();
const typeController = require('../controllers/typeController');
const validateJoi = require('../middleware/validateJoi');
const schemas = require('../validation/schemas');

router.post('/', validateJoi(schemas.type), typeController.createType);
router.get('/', typeController.getAllTypes);
router.delete('/:id', typeController.deleteType);

module.exports = router;