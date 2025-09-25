// middlewares/checkDuplicateUser.js
const User = require('../models/user');

async function checkDuplicateUser(req, res, next) {
  try {
    const FromecookieUsername = req.session.username;
    const FromecookieUserId = req.session.userId;

    // ตรวจสอบว่ามี email ซ้ำ
    const existingUser = await User.findOne({
      $and: [
        FromecookieUsername,
        FromecookieUserId
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'ไม่พบผู้ใช้งาน'
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
