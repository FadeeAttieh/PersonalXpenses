const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateJoi = require('../middleware/validateJoi');
const schemas = require('../validation/schemas');

router.post('/register', validateJoi(schemas.register), authController.register);
router.post('/verify-email', authController.verifyEmail);
router.post('/login', validateJoi(schemas.login), authController.login);
router.post('/resend-verification', authController.resendVerification);

module.exports = router;