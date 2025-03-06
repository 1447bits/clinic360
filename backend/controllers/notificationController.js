// controllers/notificationController.js
const Notification = require('../models/Notification');
const User = require('../models/User');
const emailService = require('../utils/emailService');

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 }); // Most recent first
    
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id;
    
    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    // Ensure the notification belongs to the user
    if (notification.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this notification' });
    }
    
    notification.isRead = true;
    await notification.save();
    
    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await Notification.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } }
    );
    
    res.json({ 
      message: 'All notifications marked as read',
      count: result.modifiedCount 
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.sendNotification = async (req, res) => {
  try {
    const { userId, type, message, emailSubject, emailText } = req.body;
    
    if (!userId || !type || !message) {
      return res.status(400).json({ message: 'userId, type, and message are required' });
    }
    
    // Create notification in database
    const newNotification = new Notification({
      userId,
      type,
      message,
      isRead: false
    });
    
    await newNotification.save();
    
    // If email details are provided, send email
    if (emailSubject && emailText) {
      const user = await User.findById(userId);
      
      if (user && user.email) {
        await emailService.sendEmail(
          user.email,
          emailSubject,
          emailText
        );
      }
    }
    
    res.status(201).json({ 
      message: 'Notification created and sent successfully',
      notification: newNotification
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id;
    
    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    // Ensure the notification belongs to the user
    if (notification.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this notification' });
    }
    
    await notification.delete();
    
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createNotification = async (userId, type, message) => {
  try {
    const newNotification = new Notification({
      userId,
      type,
      message,
      isRead: false
    });
    
    await newNotification.save();
    return newNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};