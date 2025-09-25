require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
/*const cookieParser = require('cookie-parser');*/
const JWT = require('jsonwebtoken');
const User = require('./models/user')
// Controllers
// const conTroller = require('./controllers/indexcontrolller')
// const loginconTroller = require('./controllers/logincontroller')
// const registerconTroller = require('./controllers/registercontroller')
// const logoutconTroller = require('./controllers/logoutcontroller')
const storeUserController = require('./controllers/storeUsercontroller');
const loginUserController = require('./controllers/loginUsercontroller');
const saveTasktoday = require('./controllers/storetodayUsercontroller')
// Middlewares
const checkDuplicateUser = require('./middleweres/checkDuplicateUser');
const SearchUser = require('./middleweres/auth')
const pull_task = require('./controllers/pull-task')
const check_pull_task = require('./middleweres/checkpulltask')
// Routes
// const router = require('./routes/rout')

const app = express();
global.loggedIn = null;

const secret = process.env.secret;
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));


// Middleware session
app.use(
  session({
    secret: secret,      // ใช้เข้ารหัส session id
    resave: false,              // ไม่บันทึก session ซ้ำถ้าไม่มีการเปลี่ยนแปลง
    saveUninitialized: false,    // บันทึก session ใหม่ที่ยังไม่มีการแก้ไข
    cookie: { maxAge: 1000 * 60 * 60,// อายุ 1 ชั่วโมง
      httpOnly: true,     // ป้องกัน JS ฝั่ง client อ่าน cookie
      secure: false,      // ถ้าใช้ http ให้ false, ถ้า https ให้ true
      sameSite: "lax"     // หรือ "none" ถ้า frontend- backend อยู่คนละ domain
     }  
  })
);

app.use((req, res, next) => {
  loggedIn = req.session.userId;
  next();
});

app.use(flash());
app.set('view engine', 'ejs');

// Routes
app.post('/api/register', checkDuplicateUser, storeUserController);
app.post('/api/login', loginUserController);

// ตัวอย่าง: ตั้งค่า session
app.get('/profile', (req, res) => {
  res.json({
    username : req.session.username,
    userId : req.session.userId
  })
  console.log(req.session.username)
  /*res.json({ username: req.session.username });*/
});

// ตัวอย่าง: อ่าน session
app.get('/get-session', (req, res) => {
  if (req.session.username) {
    res.send(`คุณคือ: ${req.session.username}`);
  } else {
    res.send('ยังไม่มี session');
  }
});

// ตัวอย่าง: ลบ session (logout)
app.get('/destroy-session', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.send('เกิดข้อผิดพลาด');
    res.clearCookie('connect.sid'); // ลบ cookie ออกด้วย
    res.send('Session ถูกลบแล้ว!');
  });
});
app.get('/user-pull-task',pull_task)
app.post('/savetask',saveTasktoday)
// Default route
// app.get('/', (req, res) => res.send('API is running'));

// Server listen
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

// MongoDB connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

