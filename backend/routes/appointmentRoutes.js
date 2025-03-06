// routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Get all appointments for logged-in user (patient or doctor)
router.get('/', auth, appointmentController.getAppointments);

// Book a new appointment
router.post('/', auth, roleCheck('patient'), appointmentController.bookAppointment);

// Get available time slots based on doctor's availability
router.get('/available-slots', auth, appointmentController.getAvailableSlots);

// Get details of a specific appointment
router.get('/:id', auth, appointmentController.getAppointmentById);

// Cancel an appointment
router.put('/:id/cancel', auth, appointmentController.cancelAppointment);

// Confirm an appointment (doctor confirms patient's booking)
router.post('/:id/confirm', auth, roleCheck('doctor'), appointmentController.confirmAppointment);

module.exports = router;