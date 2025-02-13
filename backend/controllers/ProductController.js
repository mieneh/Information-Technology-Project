//backend/controllers/ProductController.js

const Product = require('../models/Product');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

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
    cb(null, path.join(__dirname, '../../frontend/public/img/product'));
  },
  filename: (req, file, cb) => {
    const productName = slugify(req.body.name || 'unknown');
    cb(null, `${req.userId}-${productName}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// Lấy danh sách sản phẩm
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ userID: req.userId })
      .populate('category')
      .exec();

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

// Thêm sản phẩm mới
exports.createProduct = async (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'Lỗi khi upload hình ảnh.' });
    }

    try {
      const { category, name, description } = req.body;
      const image = req.file ? `/img/product/${req.file.filename}` : null;
      const userID = req.userId;

      const existingProduct = await Product.findOne({ name });
      if (existingProduct) {
        return res.status(400).json({ message: 'Tên sản phẩm đã tồn tại!' });
      }
      
      const product = new Product({ category, name, description, image, userID });

      await product.save();
      res.status(201).json({ message: 'Sản phẩm được thêm thành công!', product });
    } catch (error) {
      res.status(400).json({ error: error.message });
      console.log(error);
    }
  });
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'Lỗi khi upload hình ảnh.' });
    }

    const { category, name, description } = req.body;
    const image = req.file ? `/img/product/${req.file.filename}` : null;

    try {
      const product = await Product.findOne({ _id: req.params.id, userID: req.userId });
      if (!product) {
        return res.status(400).json({ message: 'Truy cập bị từ chối hoặc không tìm thấy sản phẩm.' });
      }

      if (image && product.image) {
        const oldImagePath = path.join(__dirname, '../../frontend/public', product.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Lỗi khi xóa ảnh cũ:', err);
        });
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          name,
          description,
          category,
          image: image || undefined,
        },
        { new: true }
      );

      res.status(200).json({ message: 'Sản phẩm được cập nhật thành công!', updatedProduct });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, userID: req.userId });
    if (!product) {
      return res.status(400).json({ message: 'Truy cập bị từ chối hoặc không tìm thấy sản phẩm.' });
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
    
    await Product.findOneAndDelete({ _id: req.params.id, userID: req.userId });
    res.status(200).json({ message: 'Xóa sản phẩm thành công.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};