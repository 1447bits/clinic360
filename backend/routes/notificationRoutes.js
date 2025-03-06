// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

// Get all notifications for the logged-in user
router.get('/', auth, notificationController.getNotifications);

// Mark notification as read
router.put('/:id/read', auth, notificationController.markAsRead);

// Mark all notifications as read
router.put('/read-all', auth, notificationController.markAllAsRead);

// Send email notification (internally used by the system)
router.post('/send', auth, notificationController.sendNotification);

// Delete a notification
router.delete('/:id', auth, notificationController.deleteNotification);

module.exports = router;