//backend/models/Tracking.js

const mongoose = require('mongoose');
const trackingSchema = new mongoose.Schema({
    harvestID: { type: mongoose.Schema.Types.ObjectId, ref: 'Harvest', required: true },
    location: { type: mongoose.Schema.Types.Mixed },
    temperature: { type: mongoose.Decimal128 },
    humidity: { type: mongoose.Decimal128 },
    status: { type: String },
    timestamp: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});
const Tracking = mongoose.model('Tracking', trackingSchema);
module.exports = Tracking;