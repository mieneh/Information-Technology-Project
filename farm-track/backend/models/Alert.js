//backend/models/Alert.js

const mongoose = require('mongoose');
const alertSchema = new mongoose.Schema({
    trackingID: { type: mongoose.Schema.Types.ObjectId, ref: 'Tracking', required: true },
    alertType: { type: String, enum: ['Nhiệt độ', 'Độ ẩm', 'Vị trí', 'Khác'], required: true },
    description: { type: String },
    created: { type: Date, default: Date.now },
    resolved: { type: String, enum: ['Chưa xử lý', 'Đã xử lý'], required: true }
});
const Alert = mongoose.model('Alert', alertSchema);
module.exports = Alert;