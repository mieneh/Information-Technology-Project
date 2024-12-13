//backend/controllers/AuthController.js

const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Tìm admin theo tên đăng nhập
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({ success: false, message: 'Tên đăng nhập không đúng' });
        }

        // So sánh mật khẩu với mật khẩu trong cơ sở dữ liệu
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Mật khẩu không đúng' });
        }

        // Tạo token JWT
        const token = jwt.sign(
            { id: admin._id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Hết hạn trong 1 giờ
        );

        // Trả về token và thông tin admin
        res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công',
            token,
            admin, // Trả về thông tin admin nếu cần thiết
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
};

module.exports = { login };