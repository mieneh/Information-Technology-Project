//backend/controllers/ProcessController.js

const mongoose = require('mongoose');
const Process = require('../models/Process');

// Lấy danh sách quy trình sản xuất
exports.getProcesses = async (req, res) => {
  try {
    const processes = await Process.find({ userID: req.userId });
    if (!processes || processes.length === 0) {
      return res.status(404).json({ message: 'Không có quy trình sản xuất nào.' });
    }
    res.status(200).json(processes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Thêm quy trình sản xuất
exports.createProcess = async (req, res) => {
  try {
    const { name, steps } = req.body;
    const userID = req.userId;

    // Kiểm tra xem steps có phải là mảng hay không
    if (!Array.isArray(steps) || steps.length === 0) {
      return res.status(400).json({ error: 'Steps phải là mảng đối tượng và không thể để trống' });
    }

    // Kiểm tra xem các bước (steps) có đúng định dạng hay không
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      if (!step.name || !step.content) {
        return res.status(400).json({ error: `Bước ${i + 1} phải có tên và nội dung` });
      }
    }

    const process = new Process({ name, steps, userID });

    await process.save();
    res.status(201).json({ message: 'Quy trình sản xuất đã được thêm thành công', process });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật quy trình sản xuất
exports.updateProcess = async (req, res) => {
  try {
    const processId = req.params.id;
    const { name, steps } = req.body;
    const userID = req.userId;

    // Kiểm tra ID có hợp lệ không
    if (!processId || !mongoose.Types.ObjectId.isValid(processId)) {
      return res.status(400).json({ error: 'ID quy trình không hợp lệ' });
    }

    // Kiểm tra xem steps có phải là mảng hay không
    if (steps && (!Array.isArray(steps) || steps.length === 0)) {
      return res.status(400).json({ error: 'Steps phải là mảng đối tượng và không thể để trống' });
    }

    // Kiểm tra xem các bước (steps) có đúng định dạng hay không
    if (steps) {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        if (!step.name || !step.content) {
          return res.status(400).json({ error: `Bước ${i + 1} phải có tên và nội dung` });
        }
      }
    }

    // Kiểm tra xem quy trình có tồn tại và thuộc về người dùng hay không
    const process = await Process.findOne({ _id: processId, userID });
    if (!process) {
      return res.status(404).json({ error: 'Quy trình không tồn tại hoặc không thuộc về bạn' });
    }

    // Cập nhật quy trình
    process.name = name || process.name;
    if (steps) {
      process.steps = steps;
    }

    await process.save();

    res.status(200).json({ message: 'Quy trình đã được cập nhật thành công', process });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa quy trình sản xuất
exports.deleteProcess = async (req, res) => {
  try {
    const processId = req.params.id;
    
    // Kiểm tra sự tồn tại của quy trình
    const process = await Process.findOne({ _id: processId, userID: req.userId });
    if (!process) {
      return res.status(404).json({ message: 'Không tìm thấy quy trình sản xuất hoặc truy cập bị từ chối.' });
    }

    // Xóa quy trình
    await Process.findByIdAndDelete(processId);
    res.status(200).json({ message: 'Quy trình sản xuất đã được xóa thành công.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};