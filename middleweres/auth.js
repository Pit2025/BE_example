const Tasktoday = require('../models/Taskuser');
const User = require('../models/user');


async function SearchUser(req , res , next ){
    try{
    const existingUser = await Tasktoday.findOne({ userId: req.session.userId })
    if(existingUser){console.log('ค้นพบtaskของ user')}
    if (!existingUser) {
      console.log("ไม่ค้นพบ task")
      return res.status(400).json({
        success: false,
        message: 'คุณต้องล็อกอินก่อน'
      });
    }
    next();
    } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์'
    });
  }
}


module.exports = SearchUser;