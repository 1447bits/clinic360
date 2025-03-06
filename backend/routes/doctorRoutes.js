// routes/doctorRoutes.js
const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Search for doctors (public route)
router.get('/', doctorController.searchDoctors);

// Get doctor by ID (public route)
router.get('/:id', doctorController.getDoctorById);

// Update doctor profile (doctor only)
router.put('/:id', auth, roleCheck('doctor'), doctorController.updateDoctor);

// Set availability slots (doctor only)
router.post('/:id/availability', auth, roleCheck('doctor'), doctorController.setAvailability);

// Get availability slots for a doctor (public route)
router.get('/availability/:id', doctorController.getAvailability);

module.exports = router;