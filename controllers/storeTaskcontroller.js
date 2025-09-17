/* เพิ่ม user ใหม่
const newUser = new User({ username: "พลทิป", password: "12345" });
await newUser.save();*/
const Task =require('../models/user')


/* เพิ่ม task ใหม่ที่ผูกกับ user
const newTask = new Task({
  title: "ทำการบ้านฟิสิกส์",
  description: "หน้า 25 เลข 3",
  user: newUser._id    อ้างถึง user ที่สร้างไว้
});*/


module.exports = async (req, res) => {
    try {
    await newTask.save();
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: 'อีเมลนี้ถูกใช้งานแล้ว' });
        }
        // error อื่น ๆ
    }

    User.create(req.body).then(()=>{ 
        console.log('user register successfully')
        res.json({ success: true });
    }).catch((error) => {
        console.log(error)
        if (error && error){
            const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message)
            req.flash('validationErrors', validationErrors)
            req.flash('data', req.body)
            
        }
        return  res.json({ success: false });   
    })   
}


