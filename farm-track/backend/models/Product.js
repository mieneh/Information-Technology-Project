//backend/models/Product.js

const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['Rau', 'Củ', 'Quả', 'Hạt', 'Trái cây'], required: true },
    description: { type: String },
    image: { type: String },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});
const Product = mongoose.model('Product', productSchema);
module.exports = Product;