const User = require('../models/user');


async function SearchUser(req , res , next ){
    try{
    const FromCookie = req.cookies.userId;
    const FromCookie2 = req.cookies.username
    const existingUser = await User.findOne({
    $and: [
        {FromCookie}
        ,{FromCookie2}
    ]
    })
    if(existingUser){console.log('ใช่เลย')}
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: 'คุณต้องล็อกอินก่อน'
      });
    }
    next();;
    } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์'
    });
  }
}


module.exports = SearchUser;