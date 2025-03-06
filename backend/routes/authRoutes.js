// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Register routes
router.post('/register/patient', authController.registerPatient);
router.post('/register/doctor', authController.registerDoctor);

// Login route
router.post('/login', authController.login);

// Get logged-in user
router.get('/me', auth, authController.getMe);

// Request password reset
router.post('/reset-password', authController.resetPassword);

module.exports = router;