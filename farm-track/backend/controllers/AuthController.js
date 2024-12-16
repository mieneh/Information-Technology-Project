//backend/controllers/AuthController.js

const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        const isMatch = await admin.comparePassword(password);
        if (!admin || !isMatch) {
            return res.status(400).json({ success: false, message: 'Tên đăng nhập hoăc mmật khẩu không đúng' });
        }
        const token = jwt.sign({ adminId: admin._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.status(200).json({ success: true, message: 'Đăng nhập thành công', token, admin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
};