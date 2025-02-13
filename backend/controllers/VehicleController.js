//backend/controllers/VehicleController.js

const Vehicle = require('../models/Vehicle');

// Lấy danh sách phương tiện
exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ userID: req.userId });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Thêm phương tiện
exports.createVehicle = async (req, res) => {
  try {
    const { type, plateNumber, capacity, maintenanceStatus } = req.body;
    const userID = req.userId;

    const vehicle = new Vehicle({ type, plateNumber, capacity, maintenanceStatus, userID });

    await vehicle.save();
    res.status(201).json({ message: 'Đã thêm phương tiện thành công', vehicle });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error);
  }
};

// Cập nhật phương tiện
exports.updateVehicle = async (req, res) => {
  try {
    const updates = req.body;

    const vehicle = await Vehicle.findOne({ _id: req.params.id, userID: req.userId });
    if (!vehicle) {
      return res.status(400).json({ message: 'Phương tiện không tìm thấy hoặc truy cập bị từ chối.' });
    }

    const updatedVehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, userID: req.userId },
      updates,
      { new: true }
    );

    res.status(200).json({ message: 'Phương tiện đã cập nhật thành công.', updatedVehicle });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error);
  }
};

// Xóa phương tiện
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, userID: req.userId });
    if (!vehicle) {
      return res.status(400).json({ message: 'Phương tiện không tìm thấy hoặc truy cập bị từ chối.' });
    }
    await Vehicle.findOneAndDelete({ _id: req.params.id, userID: req.userId });
    res.status(200).json({ message: 'Phương tiện đã xóa thành công.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error);
  }
};