//backend/controllers/DriverController.js

const Driver = require('../models/Driver');

// Lấy danh sách tài xế
exports.getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({ userID: req.userId });
    res.status(200).json(drivers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Thêm tài xế
exports.createDriver = async (req, res) => {
  try {
    const { name, sdt, GPLX } = req.body;
    const userID = req.userId;

    const driver = new Driver({ name, sdt, GPLX, userID });

    await driver.save();
    res.status(201).json({ message: 'Thông tin tài xế đã được thêm thành công.', driver });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error);
  }
};

// Cập nhật tài xế
exports.updateDriver = async (req, res) => {
  try {
    const updates = req.body;

    const driver = await Driver.findOne({ _id: req.params.id, userID: req.userId });
    if (!driver) {
      return res.status(400).json({ message: 'Không tìm thấy thông tin tài xế hoặc quyền truy cập bị từ chối' });
    }

    const updatedDriver = await Driver.findOneAndUpdate(
      { _id: req.params.id, userID: req.userId },
      updates,
      { new: true }
    );

    res.status(200).json({ message: 'Thông tin tài xế đã cập nhật thành công.', updatedDriver });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error);
  }
};

// Xóa tài xế
exports.deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findOne({ _id: req.params.id, userID: req.userId });
    if (!driver) {
      return res.status(400).json({ message: 'Không tìm thấy thông tin tài xế hoặc quyền truy cập bị từ chối' });
    }
    await Driver.findOneAndDelete({ _id: req.params.id, userID: req.userId });
    res.status(200).json({ message: 'Thông tin tài xế đã xóa thành công.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error);
  }
};