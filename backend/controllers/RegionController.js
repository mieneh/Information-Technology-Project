//backend/controllers/RegionController.js

const Region = require('../models/Region');

// Lấy danh sách vùng sản xuất
exports.getRegions = async (req, res) => {
  try {
    const regions = await Region.find({ userID: req.userId });
    res.status(200).json(regions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Thêm vùng sản xuất
exports.createRegion = async (req, res) => {
  try {
    const { type, name, address, area, description } = req.body;
    const userID = req.userId;
    const region = new Region({type, name, address, area, description, userID});
    await region.save();
    res.status(201).json({ message: 'Đã thêm vùng sản xuất thành công.', region });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật vùng sản xuất
exports.updateRegion = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const region = await Region.findOne({ _id: id, userID: req.userId });
    if (!region) {
      return res.status(403).json({message: 'Truy cập bị từ chối hoặc không tìm thấy vùng sản xuất.'});
    }

    const updatedRegion = await Region.findOneAndUpdate(
      { _id: id, userID: req.userId },
      updates,
      { new: true }
    );

    res.status(200).json({ message: 'Vùng sản xuất đã cập nhật thành công.', updatedRegion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa vùng sản xuất
exports.deleteRegion = async (req, res) => {
  try {
    const { id } = req.params;

    const region = await Region.findOne({ _id: id, userID: req.userId });
    if (!region) {
      return res.status(403).json({message: 'Truy cập bị từ chối hoặc không tìm thấy vùng sản xuất.'});
    }

    await Region.findOneAndDelete({ _id: id, userID: req.userId });
    res.status(200).json({ message: 'Vùng sản xuất đã xóa thành công.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};