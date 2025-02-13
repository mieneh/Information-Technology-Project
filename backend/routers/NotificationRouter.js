//backend/routers/NotificationRouter.js

const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/NotificationController');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/', authenticateToken, notificationController.getNotifications);
router.patch('/:id/read', authenticateToken, notificationController.markAsRead);
router.patch('/mark-all-read', authenticateToken, notificationController.markAllAsRead);
router.post('/', authenticateToken, notificationController.createNotification);
router.delete('/:id', authenticateToken, notificationController.deleteNotification);
router.delete('/user', authenticateToken, notificationController.clearAllNotifications);

module.exports = router;