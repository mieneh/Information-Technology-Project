//backend/controllers/RouteController.js

const Route = require('../models/Route');
const Notification = require('../models/Notification');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Harvest = require('../models/Harvest');

// Lấy danh sách lộ trình
exports.getRoutes = async (req, res) => {
  try {
    const routes = await Route.find({ userID: req.userId })
    .populate({ path: 'vehicleID', model: Vehicle })
    .populate({ path: 'driverID', model: Driver })
    .populate({ path: 'batchID', model: Harvest });
    res.status(200).json(routes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Thêm lộ trình
exports.createRoute = async (req, res) => {
  try {
    const { vehicleID, driverID, batchID, origin, destination, departureTime, estimatedArrival } = req.body;
    const userID = req.userId;

    const route = new Route({ vehicleID, driverID, batchID, origin, destination, departureTime, estimatedArrival, userID });
    await route.save();

    const harvest = await Harvest.findById(batchID);
    const content = `Lô hàng ${harvest.batch} đã được lên đơn và đang chờ vận chuyển`;
    const notifications = [ { userID: harvest.userID, content, type: 'order' }, { userID: harvest.distributorID, content, type: 'order' } ];
    await Notification.insertMany(notifications);

    res.status(201).json({ message: 'Lộ trình đã được thêm thành công', route });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Cập nhật lộ trình
exports.updateRoute = async (req, res) => {
  try {
    const updates = req.body;
    const route = await Route.findOne({ _id: req.params.id, userID: req.userId });
    if (!route) {
      return res.status(400).json({ message: 'Lộ trình không tìm thấy hoặc truy cập bị từ chối.' });
    }

    const updatedRoute = await Route.findOneAndUpdate(
      { _id: req.params.id, userID: req.userId },
      updates,
      { new: true }
    );

    res.status(200).json({ message: 'Lộ trình đã cập nhật thành công.', updatedRoute });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Xóa lộ trình
exports.deleteRoute = async (req, res) => {
  try {
    const route = await Route.findOne({ _id: req.params.id, userID: req.userId });
    if (!route) {
      return res.status(400).json({ message: 'Lộ trình không tìm thấy hoặc truy cập bị từ chối.' });
    }
    await Route.findOneAndDelete({ _id: req.params.id, userID: req.userId });
    res.status(200).json({ message: 'Lộ trình đã xóa thành công.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};