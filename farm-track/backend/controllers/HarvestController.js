//backend/controllers/HarvestController.js
const Harvest = require('../models/Harvest');
const Product = require('../models/Product');
const Tracking = require('../models/Tracking');

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

// Thêm đợt thu hoạch mới
exports.createHarvest = async (req, res) => {
    const { productID, batch, harvestDate, expirationDate, quantity, certification } = req.body;

    try {
        const newHarvest = new Harvest({ productID, batch, harvestDate, expirationDate, quantity, certification });
        await newHarvest.save();

        // Tạo QR code với đường dẫn
        const qrCodeURL = `http://localhost:3001/harvest/${newHarvest._id}`;
        const qrCode = await QRCode.toDataURL(qrCodeURL);

        newHarvest.qrCode = qrCode;
        await newHarvest.save();

        res.status(201).json({ message: 'Đợt thu hoạch được tạo thành công!', harvest: newHarvest });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo đợt thu hoạch', error });
    }
};

// Câp nhật thông tin đợt thu hoạch
exports.updateHarvest = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const harvest = await Harvest.findById(id);
        if (!harvest) {
            return res.status(404).json({ message: 'Đợt thu hoạch không tồn tại.' });
        }

        if (updateData.harvestDate && isNaN(Date.parse(updateData.harvestDate))) {
            return res.status(400).json({ message: 'Ngày thu hoạch không hợp lệ.' });
        }
        if (updateData.expirationDate && isNaN(Date.parse(updateData.expirationDate))) {
            return res.status(400).json({ message: 'Ngày hết hạn không hợp lệ.' });
        }

        Object.keys(updateData).forEach((key) => {
            if (updateData[key] !== undefined) {
                harvest[key] = updateData[key];
            }
        });

        // Tạo lại QR code nếu thông tin đợt thu hoạch thay đổi (nếu cần)
        const qrCodeURL = `http://localhost:3001/harvest/${harvest._id}`;
        const qrCode = await QRCode.toDataURL(qrCodeURL);
        harvest.qrCode = qrCode;

        await harvest.save();

        res.json({ message: 'Cập nhật đợt thu hoạch thành công.', harvest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi cập nhật đợt thu hoạch.', error });
    }
};

// Xóa đợt thu hoạch
exports.deleteHarvest = async (req, res) => {
    try {
        await Harvest.findByIdAndDelete(req.params.id);
        res.json({ message: 'Xóa đợt thu hoạch thành công' });
    } catch (error) {
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