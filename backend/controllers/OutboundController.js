//backend/controllers/OutboundController.js

const Outbound = require('../models/Outbound');
const Inbound = require('../models/Inbound');
const Retailer = require('../models/Retailer');
const Harvest = require('../models/Harvest');
const Product = require('../models/Product');

// Lấy danh sách xuất kho
exports.getOutbounds = async (req, res) => {
  try {
    const outbounds = await Outbound.find({ userID: req.userId })
      .populate({path: 'entryID', model: Inbound, populate: { path: 'batchID', model: Harvest, populate: [{ path: 'product', model: Product }],},})
      .populate({path: 'retailerID', model: Retailer});
    res.status(200).json(outbounds);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Thêm xuất kho
exports.createOutbound = async (req, res) => {
  try {
    const { exitDate, entryID, quantity, note, retailerID } = req.body;
    const userID = req.userId;

    const outbound = new Outbound({ exitDate, entryID, quantity, note, retailerID, userID });
    await outbound.save();
    res.status(201).json({ message: 'Đơn xuất kho đã được thêm thành công.', outbound });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error);
  }
};

// Cập nhật xuất kho
exports.updateOutbound = async (req, res) => {
  try {
    const updates = req.body;

    const outbound = await Outbound.findOne({ _id: req.params.id, userID: req.userId });
    if (!outbound) {
      return res.status(400).json({ message: 'Đơn xuất kho không tìm thấy hoặc truy cập bị từ chối.' });
    }

    const updatedOutbound = await Outbound.findOneAndUpdate(
      { _id: req.params.id, userID: req.userId },
      updates,
      { new: true }
    );

    res.status(200).json({ message: 'Đơn xuất kho đã cập nhật thành công.', updatedOutbound });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error);
  }
};

// Xóa xuất kho
exports.deleteOutbound = async (req, res) => {
  try {
    const outbound = await Outbound.findOne({ _id: req.params.id, userID: req.userId });
    if (!outbound) {
      return res.status(400).json({ message: 'Đơn xuất kho không tìm thấy hoặc truy cập bị từ chối.' });
    }
    await Outbound.findOneAndDelete({ _id: req.params.id, userID: req.userId });
    res.status(200).json({ message: 'Đơn xuất kho đã xóa thành công.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error);
  }
};