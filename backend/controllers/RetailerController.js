//backend/controllers/RetailerController.js

const Retailer = require('../models/Retailer');

// Lấy danh sách nhà bán lẻ
exports.getRetailers = async (req, res) => {
  try {
    const retailers = await Retailer.find({ userID: req.userId });
    res.status(200).json(retailers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Thêm nhà bán lẻ
exports.createRetailer = async (req, res) => {
  try {
    const { type, fullname, address, phone, email } = req.body;
    const userID = req.userId;

    const retailer = new Retailer({ type, fullname, address, phone, email, userID });

    await retailer.save();
    res.status(201).json({ message: 'Nhà bán lẻ đã được thêm thành công.', retailer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Cập nhật nhà bán lẻ
exports.updateRetailer = async (req, res) => {
  try {
    const updates = req.body;

    const retailer = await Retailer.findOne({ _id: req.params.id, userID: req.userId });
    if (!retailer) {
      return res.status(400).json({ message: 'Không tìm thấy nhà bán lẻ hoặc quyền truy cập bị từ chối.' });
    }

    const updatedRetailer = await Retailer.findOneAndUpdate(
      { _id: req.params.id, userID: req.userId },
      updates,
      { new: true }
    );

    res.status(200).json({ message: 'Nhà bán lẻ đã cập nhật thành công.', updatedRetailer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Xóa nhà bán lẻ
exports.deleteRetailer = async (req, res) => {
  try {
    const retailer = await Retailer.findOne({ _id: req.params.id, userID: req.userId });
    if (!retailer) {
      return res.status(400).json({ message: 'Không tìm thấy nhà bán lẻ hoặc quyền truy cập bị từ chối.' });
    }
    await Retailer.findOneAndDelete({ _id: req.params.id, userID: req.userId });
    res.status(200).json({ message: 'Nhà bán lẻ đã xóa thành công.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};