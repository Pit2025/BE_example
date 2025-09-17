// middlewares/checkDuplicateUser.js
const User = require('../models/user');

async function checkDuplicateUser(req, res, next) {
  try {
    const { email, username } = req.body;

    // ตรวจสอบว่ามี email ซ้ำ
    const existingUser = await User.findOne({
      $or: [
        { email: email },
        { username: username }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'ชื่อผู้ใช้หรืออีเมลนี้ถูกใช้งานแล้ว'
      });
    }

    // ถ้าไม่ซ้ำ → ให้ไปขั้นตอนต่อไป
    next();

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์'
    });
  }
}

module.exports = checkDuplicateUser;
