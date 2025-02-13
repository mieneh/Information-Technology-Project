//backend/controllers/SensorController.js

const Sensor = require('../models/Sensor');
const Harvest = require('../models/Harvest');
const Product = require('../models/Product');
const User = require('../models/User');
const Route = require('../models/Route');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');

// Lấy danh sách cảm biến
exports.getSensors = async (req, res) => {
  try {
    const sensors = await Sensor.find();
    res.status(200).json(sensors);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createSensor = async (req, res) => {
  try {  
    const { batchID, temperature, humidity, light, latitude, longitude } = req.body;
    const newData = new Sensor({ batchID, temperature, humidity, light, latitude, longitude });
    await newData.save();
  
    res.status(201).json({ message: 'Thông tin ghi nhận trên cảm biến đã được thêm thành công', route });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.checkTracking = async (req, res) => { 
  const { batchID } = req.body;

  try {
    const harvest = await Harvest.findOne({ batch: batchID });
    if (!harvest) {
      return res.status(404).json({ message: "Không tìm thấy lô hàng với tên này." });
    }

    // Tìm Route theo batchID và populate thông tin xe và tài xế
    const route = await Route.findOne({ batchID: harvest._id })
      .populate({ path: 'vehicleID', model: Vehicle })
      .populate({ path: 'driverID', model: Driver })
      .populate({
        path: 'batchID',
        model: Harvest,
        populate: [
          { path: 'product', model: Product },
          { path: 'userID', model: User },
          { path: 'distributorID', model: User },
          { path: 'transporterID', model: User }
        ]
      });

    if (!route) {
      return res.status(404).json({ message: "Không tìm thấy lô hàng này hoặc lô hàng đã được xử lý." });
    }

    // Kiểm tra nếu trạng thái là 'pending'
    if (route.status === 'Pending') {
      route.status = 'Processing';
      await route.save();
      
      // const content = `Lô hàng ${harvest.batch} đã bắt đầu vận chuyển.`;
      // const notifications = [ { userID: harvest.userID, content, type: 'order' }, { userID: harvest.distributorID, content, type: 'order' } ];
      // await Notification.insertMany(notifications);

      return res.status(200).json(route);
    } else if (route.status === 'Completed') {
      return res.status(400).json({ message: "Lô hàng này đã được giao thành công và không thể bắt đầu lại." });
    } else {
      return res.status(400).json({ message: "Lô hàng này đang trong quá trình vận chuyển." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.endTracking = async (req, res) => {
  const { batchID } = req.body;
  try {
    const harvest = await Harvest.findOne({ batch: batchID });
    if (!harvest) {
      return res.status(404).json({ message: "Không tìm thấy lô hàng với tên này." });
    }
    
    const route = await Route.findOne({batchID: harvest._id})
    if (!route) {
      return res.status(404).json({ message: "Không tìm thấy lô hàng này hoặc lô hàng đã được vận chuyển thành công." });
    }
        
    route.status = 'Completed';
    await route.save();

    // const content = `Lô hàng ${harvest.batch} đã được giao thành công.`;
    // const notifications = [ { userID: harvest.userID, content, type: 'order' }, { userID: harvest.distributorID, content, type: 'order' } ];
    // await Notification.insertMany(notifications);

    return res.status(200).json({ message: "Hoàn tất lô hàng và dữ liệu đã được lưu." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSensorById = async (req, res) => {
  try {
    const harvest = await Harvest.findById(req.params.id);
    if (!harvest) {
        return res.status(404).json({ message: "Không tìm thấy lô hàng này." });
    }

    const sensor = await Sensor.find({batchID: harvest.batch});
    res.status(200).json(sensor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};