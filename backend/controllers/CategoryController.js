//backend/controllers/CategoryController.js

const Category = require('../models/Category');

// Lấy danh sách loại sản phẩm
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ userID: req.userId });
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Thêm loại sản phẩm
exports.createCategory = async (req, res) => {
  try {
    const { name, description, expiry, maxday } = req.body;
    const userID = req.userId;

    const category = new Category({ name, description, expiry, maxday, userID });

    await category.save();
    res.status(201).json({ message: 'Category added successfully', category });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error);
  }
};

// Cập nhật loại sản phẩm
exports.updateCategory = async (req, res) => {
  try {
    const updates = req.body;

    const category = await Category.findOne({ _id: req.params.id, userID: req.userId });
    if (!category) {
      return res.status(400).json({ message: 'Truy cập bị từ chối hoặc không tìm thấy danh mục.' });
    }

    const updatedCategory = await Category.findOneAndUpdate(
      { _id: req.params.id, userID: req.userId },
      updates,
      { new: true }
    );

    res.status(200).json({ message: 'Đã cập nhật danh mục thành công.', updatedCategory });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error);
  }
};

// Xóa loại sản phẩm
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, userID: req.userId });
    if (!category) {
      return res.status(400).json({ message: 'Truy cập bị từ chối hoặc không tìm thấy danh mục.' });
    }
    await Category.findOneAndDelete({ _id: req.params.id, userID: req.userId });
    res.status(200).json({ message: 'Đã xóa danh mục thành công.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error);
  }
};