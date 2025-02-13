const Notification = require('../models/Notification');

// Lấy danh sách thông báo cho người dùng
exports.getNotifications = async (req, res) => {
  try {
    const userID = req.userId;
    const notifications = await Notification.find({ userID }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Đánh dấu thông báo là đã đọc
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: 'Không tìm thấy thông báo nào.' });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Đánh dấu tất cả thông báo là đã đọc
exports.markAllAsRead = async (req, res) => {
    try {
      const userID = req.userId;
      const result = await Notification.updateMany(
        { userID, read: false },
        { $set: { read: true } }
      );
      res.status(200).json({message: 'Tất cả thông báo được đánh dấu là đã đọc thành công.', modifiedCount: result.modifiedCount});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
  
// Tạo thông báo mới
exports.createNotification = async (req, res) => {
  try {
    const { content, type } = req.body;
    const userID = req.userId;
    const newNotification = new Notification({
      userID,
      content,
      type,
    });
    const savedNotification = await newNotification.save();
    res.status(201).json(savedNotification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa thông báo
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNotification = await Notification.findByIdAndDelete(id);
    if (!deletedNotification) {
      return res.status(404).json({ message: 'Không tìm thấy thông báo.' });
    }
    res.status(200).json({ message: 'Thông báo đã được xóa thành công.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa tất cả thông báo cho một người dùng
exports.clearAllNotifications = async (req, res) => {
  try {
    const userID = req.userId;
    await Notification.deleteMany({ userID });
    res.status(200).json({ message: 'Đã xóa tất cả thông báo thành công.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};