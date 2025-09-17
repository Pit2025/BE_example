const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

app.use(cors()); // ให้ frontend เรียก API ได้
app.use(express.json()); // เพื่ออ่าน JSON body

// สมมติ schema user ง่ายๆ
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
const User = mongoose.model('User', userSchema);

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  if(!email || !password) {
    return res.status(400).json({ success: false, message: 'กรุณากรอก email และ password' });
  }
  
  try {
    // หา user จากฐานข้อมูล
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'ไม่พบผู้ใช้' });
    }
    
    // เช็ครหัสผ่าน (ในนี้ยังไม่ได้เข้ารหัส)
    if (user.password !== password) {
      return res.status(401).json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' });
    }
    
    // สำเร็จ
    return res.json({ success: true, message: 'ล็อกอินสำเร็จ' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
  }
});

mongoose.connect('mongodb+srv://...your uri...', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  app.listen(4000, () => console.log('Server running on port 4000'));
});
