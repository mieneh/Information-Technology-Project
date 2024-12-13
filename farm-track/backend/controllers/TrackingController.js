//backend/controllers/TrackingController.js

const Tracking = require('../models/Tracking');

// Lấy thông tin theo dõi của đợt thu hoạch
exports.getTrackingByHarvest = async (req, res) => {
    try {
        const trackings = await Tracking.find({ harvestID: req.params.harvestID });
        res.json(trackings);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thông tin theo dõi', error });
    }
};

// Thêm thông tin theo dõi mới
exports.addTracking = async (req, res) => {
    try {
        const tracking = await Tracking.create(req.body);
        res.status(201).json(tracking);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi thêm thông tin theo dõi', error });
    }
};
