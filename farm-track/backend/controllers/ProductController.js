//backend/controllers/ProductController.js

const path = require('path');
const multer = require('multer');
const fs = require('fs');

const Product = require('../models/Product');
const Harvest = require('../models/Harvest');
const Tracking = require('../models/Tracking');

// Lấy danh sách sản phẩm
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().lean();
        const enrichedProducts = await Promise.all(
            products.map(async (product) => {
                const harvests = await Harvest.find({ productID: product._id }).lean();
                const enrichedHarvests = await Promise.all(
                    harvests.map(async (harvest) => {
                        const tracking = await Tracking.find({ harvestID: harvest._id }).lean();
                        return {
                            ...harvest,
                            tracking,
                        };
                    })
                );

                return {
                    ...product,
                    harvests: enrichedHarvests,
                };
            })
        );

        res.json(enrichedProducts);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm', error });
    }
};

// Hàm chuyển tên sản phẩm thành dạng slug
const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
};

// Cấu hình multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../frontend/public/img'));
    },
    filename: (req, file, cb) => {
        const productName = slugify(req.body.name || 'unknown');
        cb(null, `${productName}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

// Thêm sản phẩm mới
exports.createProduct = async (req, res) => {
    upload.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Lỗi khi upload hình ảnh.' });
        }

        const { name, type, description } = req.body;
        const image = req.file ? `img/${req.file.filename}` : null;

        try {
            const existingProduct = await Product.findOne({ name });
            if (existingProduct) {
                return res.status(400).json({ message: 'Tên sản phẩm đã tồn tại!' });
            }

            const newProduct = new Product({ name, type, description, image });
            await newProduct.save();

            res.status(201).json({ message: 'Sản phẩm được thêm thành công!', product: newProduct });
        } catch (error) {
            console.error('Error adding product:', error);
            res.status(500).json({ message: 'Có lỗi xảy ra trong khi thêm sản phẩm.' });
        }
    });
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
    upload.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Lỗi khi upload hình ảnh.' });
        }

        const { name, type, description } = req.body;
        const image = req.file ? `img/${req.file.filename}` : null;

        try {
            const product = await Product.findById(req.params.id);
        
            if (!product) {
                return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
            }
            
            if (image && product.image) {
                const oldImagePath = path.join(__dirname, '../../frontend/public', product.image);
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.error('Lỗi khi xóa ảnh cũ:', err);
                });
            }

            product.name = name || product.name;
            product.type = type || product.type;
            product.description = description || product.description;
            if (image) product.image = image;

            await product.save();

            res.status(200).json({ message: 'Sản phẩm được cập nhật thành công!', product });
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({ message: 'Có lỗi xảy ra trong khi cập nhật sản phẩm.' });
        }
    });
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
        }

        if (product.image) {
            const imagePath = path.join(__dirname, '../../frontend/public', product.image);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Lỗi khi xóa ảnh:', err);
                } else {
                    console.log('Ảnh đã được xóa:', imagePath);
                }
            });
        }

        await Product.findByIdAndDelete(req.params.id);

        res.json({ message: 'Xóa sản phẩm thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error });
    }
};

// Tìm sản phẩm theo ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).lean();
        
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }

        const harvests = await Harvest.find({ productID: product._id }).lean();
        const enrichedHarvests = await Promise.all(
            harvests.map(async (harvest) => {
                const tracking = await Tracking.find({ harvestID: harvest._id }).lean();
                return {
                    ...harvest,
                    tracking,
                };
            })
        );

        const enrichedProduct = {
            ...product,
            harvests: enrichedHarvests,
        };

        res.json(enrichedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tìm sản phẩm', error });
    }
};