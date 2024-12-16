//backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const connectToDatabase = require('./connect/Database');
const productRoutes = require('./routers/ProductRoutes');
const harvestRoutes = require('./routers/HarvestRoutes');
const trackingRoutes = require('./routers/TrackingRoutes');
const authRoutes = require('./routers/AuthRoutes');

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

// Kết nối MongoDB
connectToDatabase();

// Sử dụng các routes
app.use('/api/products', productRoutes);
app.use('/api/harvests', harvestRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/login', authRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});