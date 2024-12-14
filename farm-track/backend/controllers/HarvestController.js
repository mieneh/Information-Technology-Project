//backend/controllers/HarvestController.js
const Harvest = require('../models/Harvest');
const Product = require('../models/Product');
const Tracking = require('../models/Tracking');
const fs = require('fs');
const path = require('path');
const qr = require('qr-image');

// Lấy tất cả các đợt thu hoạch
exports.getAllHarvests = async (req, res) => {
    try {
        const harvests = await Harvest.find().lean();
        const enrichedHarvests = await Promise.all(
            harvests.map(async (harvest) => {
                const product = await Product.findById(harvest.productID).lean();
                const tracking = await Tracking.find({ harvestID: harvest._id }).lean();
                return {
                    ...harvest,
                    product,
                    tracking
                };
            })
        );

        res.json(enrichedHarvests);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách thu hoạch', error });
    }
};

exports.createHarvest = async (req, res) => {
    const { productID, batch, harvestDate, expirationDate, quantity, certification } = req.body;
    try {
        const product = await Product.findById(productID);
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
        }

        const existingHarvest = await Harvest.findOne({ batch });
        if (existingHarvest) {
            return res.status(400).json({ message: 'Tên lô hàng đã tồn tại!' });
        }

        const newHarvest = new Harvest({ productID, batch, harvestDate, expirationDate, quantity, certification });
        await newHarvest.save();

        // Tạo mã QR cho đợt thu hoạch
        const qrCode = qr.imageSync(`http://localhost:3001/harvest/${newHarvest._id}`, { type: 'png' });
        const qrDirectory = path.join(__dirname, '../../frontend/public/img/qr');
        if (!fs.existsSync(qrDirectory)) {
            fs.mkdirSync(qrDirectory, { recursive: true });
        }
        const qrPath = path.join(qrDirectory, `${newHarvest._id}.png`);
        fs.writeFileSync(qrPath, qrCode);
        newHarvest.qrCode = `/img/qr/${newHarvest._id}.png`;
        await newHarvest.save();

        res.status(201).json(newHarvest);
    } catch (error) {
        console.error('Lỗi khi thêm thu hoạch:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi thêm thu hoạch!', error: error.message });
    }
};

// Câp nhật thông tin đợt thu hoạch
exports.updateHarvest = async (req, res) => {
  const { harvestDate, expirationDate, quantity, certification } = req.body;

  try {
    // Tìm đợt thu hoạch theo ID
    const harvest = await Harvest.findById(req.params.id);

    if (!harvest) {
      return res.status(404).json({ message: 'Harvest not found' });
    }

    // Cập nhật thông tin thu hoạch
    harvest.harvestDate = harvestDate || harvest.harvestDate;
    harvest.expirationDate = expirationDate || harvest.expirationDate;
    harvest.quantity = quantity || harvest.quantity;
    harvest.certification = certification || harvest.certification;

    await harvest.save();

    res.status(200).json(harvest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating harvest data' });
  }
};

// Xóa đợt thu hoạch
exports.deleteHarvest = async (req, res) => {
    try {
        const harvest = await Harvest.findById(req.params.id);

        if (!harvest) {
            return res.status(404).json({ message: 'Đợt thu hoạch không tốn tại!' });
        }
        
        if (harvest.qrCode) {
            const qrImagePath = path.join(__dirname, '../../frontend/public', harvest.qrCode);
            fs.unlink(qrImagePath, (err) => {
                if (err) {
                    console.error('Lỗi khi xóa mã QR:', err);
                } else {
                    console.log('Mã QR đã được xóa:', qrImagePath);
                }
            });
        }

        await Harvest.findByIdAndDelete(req.params.id);

        res.json({ message: 'Xóa đợt thu hoạch thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa đợt thu hoạch:', error);
        res.status(500).json({ message: 'Lỗi khi xóa đợt thu hoạch', error });
    }
};

// Tìm thu hoạch theo ID
exports.getHarvestById = async (req, res) => {
    try {
        const harvest = await Harvest.findById(req.params.id).lean();
        if (!harvest) {
            return res.status(404).json({ message: 'Thu hoạch không tồn tại' });
        }

        const tracking = await Tracking.find({ harvestID: harvest._id }).lean();
        const enrichedHarvest = { ...harvest, tracking };

        res.json(enrichedHarvest);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tìm thu hoạch', error });
    }
};