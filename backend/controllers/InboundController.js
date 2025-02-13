//backend/controllers/InboundController.js

const Inbound = require('../models/Inbound');

// Lấy danh sách nhập kho
exports.getInbounds = async (req, res) => {
  try {
    const inbounds = await Inbound.find({ userID: req.userId })
    .populate('batchID');
    res.status(200).json(inbounds);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Thêm nhập kho
exports.createInbound = async (req, res) => {
  try {
    const { batchID, entryDate, storageCondition } = req.body;
    const userID = req.userId;

    const inbound = new Inbound({ batchID, entryDate, storageCondition, userID });

    await inbound.save();
    res.status(201).json({ message: 'Sản phẩm nhập kho đã được thêm thành công.', inbound });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Cập nhật nhập kho
exports.updateInbound = async (req, res) => {
  try {
    const updates = req.body;

    const inbound = await Inbound.findOne({ _id: req.params.id, userID: req.userId });
    if (!inbound) {
      return res.status(400).json({ message: 'Không tìm thấy sản phẩm nhập kho hoặc quyền truy cập bị từ chối.' });
    }

    const updatedInbound = await Inbound.findOneAndUpdate(
      { _id: req.params.id, userID: req.userId },
      updates,
      { new: true }
    );

    res.status(200).json({ message: 'Sản phẩm nhập kho đã cập nhật thành công.', updatedInbound });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Xóa nhập kho
exports.deleteInbound = async (req, res) => {
  try {
    const inbound = await Inbound.findOne({ _id: req.params.id, userID: req.userId });
    if (!inbound) {
      return res.status(400).json({ message: 'Không tìm thấy sản phẩm nhập kho hoặc quyền truy cập bị từ chối.' });
    }
    await Inbound.findOneAndDelete({ _id: req.params.id, userID: req.userId });
    res.status(200).json({ message: 'Sản phẩm nhập kho đã xóa thành công.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};