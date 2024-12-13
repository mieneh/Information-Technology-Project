//backend/models/Harvest.js

const mongoose = require('mongoose');
const harvestSchema = new mongoose.Schema({
    productID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    batch: { type: String, required: true, unique: true },
    harvestDate: { type: Date, required: true },
    expirationDate: { type: Date },
    quantity: { type: String },
    certification: { type: String },
    qrCode: { type: String },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

const Harvest = mongoose.model('Harvest', harvestSchema);
module.exports = Harvest;