//backend/controllers/ConnectionController.js

const Connection = require('../models/Connection');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Lấy danh sách đối tác với vai trò là Nhà Sản Xuất
exports.getConnectionsWithProducer = async (req, res) => {
    try {
        const connections = await Connection.find({ producerID: req.userId })
            .populate({ path: 'transporterID', model: User });
        res.status(200).json(connections);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Lấy danh sách đối tác với vai trò là Nhà Vận Chuyển
exports.getConnectionsWithTransporter = async (req, res) => {
    try {
      const connections = await Connection.find({ transporterID: req.userId })
        .populate({ path: 'producerID', model: User });
      
      res.status(200).json(connections);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};

// Tạo yêu cầu từ nhà vận chuyển tới nhà sản xuất
exports.createConnectionWithProducer = async (req, res) => {
    try {
        const { transporterID, message } = req.body;
        const producerID = req.userId;
        const typeProducer = "Sent"
        const typeTransporter = "Received"

        // Tìm producer
        const producer = await User.findById(producerID);
        if (!producer) {
            return res.status(404).json({ message: "Producer không tồn tại" });
        }

        // Tạo yêu cầu hợp tác trong bảng Connection
        const connection = new Connection({ producerID, transporterID, message, typeProducer, typeTransporter });
        await connection.save();

        const content = `${producer.farmName} đã gửi yêu cầu hợp tác với bạn.`;
        const notification = new Notification({ userID: transporterID, content, type: 'connection' });
        await notification.save();

        res.status(200).json({ message: 'Yêu cầu gửi thành công', connection });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

// Tạo yêu cầu từ nhà vận chuyển tới nhà sản xuất
exports.createConnectionWithTransporter = async (req, res) => {
    try {
        const { producerID, message } = req.body;
        const transporterID = req.userId;
        const typeProducer = "Received"
        const typeTransporter = "Sent"

        // Tìm farmName của producer
        const transporter = await User.findById(transporterID);
        if (!transporter) {
            return res.status(404).json({ message: "Transporter không tồn tại" });
        }

        // Tạo yêu cầu hợp tác trong bảng Connection
        const connection = new Connection({ producerID, transporterID, message, typeProducer, typeTransporter });
        await connection.save();

        const content = `${transporter.companyName} đã gửi yêu cầu hợp tác với bạn.`;
        const notification = new Notification({ userID: producerID, content, type: 'connection' });
        await notification.save();

        res.status(200).json({ message: 'Yêu cầu gửi thành công', connection });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

// Chấp nhận hoặc từ chối yêu cầu hợp tác
exports.updateConnectionStatus = async (req, res) => {
    const { status } = req.body;
    const userId = req.userId;
    
    try {
        const updateConnection = await Connection.findOneAndUpdate(
            { _id: req.params.id, $or: [{ producerID: userId }, { transporterID: userId }] },
            { status: status },
            { new: true }
        );

        if (!updateConnection) {
            return res.status(404).json({ message: 'Yêu cầu hợp tác không tìm thấy.' });
        }

        res.status(200).json({ message: 'Trạng thái yêu cầu hợp tác đã được cập nhật.', updateConnection });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Hủy yêu cầu hợp tác
exports.cancelConnectionRequest = async (req, res) => {
    try {
        const userId = req.userId;
        const connection = await Connection.findOne({ _id: req.params.id, $or: [{ producerID: userId }, { transporterID: userId }] });
        if (!connection) {
            return res.status(404).json({ message: 'Yêu cầu không tồn tại hoặc bạn không có quyền hủy yêu cầu này.' });
        }

        await Connection.findOneAndDelete({ _id: req.params.id, $or: [{ producerID: userId }, { transporterID: userId }] });
        return res.status(200).json({ message: 'Yêu cầu hợp tác đã bị hủy thành công.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình hủy yêu cầu.' });
    }
};