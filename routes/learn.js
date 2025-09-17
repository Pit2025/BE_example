const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

function signAccessToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || '15m' }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' }
  );
}
//ถ้าผมคอมเม้นไว้เพื่อกรณีศึกษาการroutes สองรูปแบบ
/** Register */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body || {};
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email, password required' });
    }

    // เช็คซ้ำซ้อน (กัน error E11000)
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(409).json({ message: 'Username or email already in use' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, passwordHash });

    // auto login หลังสมัคร (เลือกได้)
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();
    
    // แนะนำ: ส่ง refresh token ผ่าน httpOnly cookie (ตัวอย่างนี้ส่งใน body ให้เข้าใจง่าย)
    return res.status(201).json({
      user: { id: user._id, username: user.username, email: user.email },
      accessToken,
      refreshToken
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Duplicate key', keyValue: err.keyValue });
    }
    return res.status(500).json({ message: 'Server error' });
  }
});

/** Login */
router.post('/login', async (req, res) => {
  const { emailOrUsername, password } = req.body || {};
  if (!emailOrUsername || !password) {
    return res.status(400).json({ message: 'emailOrUsername & password required' });
  }

  const user = await User.findOne({
    $or: [{ email: emailOrUsername.toLowerCase() }, { username: emailOrUsername }]
  });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save();

  return res.json({
    user: { id: user._id, username: user.username, email: user.email },
    accessToken,
    refreshToken
  });
});

/** Refresh token -> new access token */
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.status(400).json({ message: 'Missing refresh token' });

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    const accessToken = signAccessToken(user);
    return res.json({ accessToken });
  } catch {
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
});

/** Logout (ยกเลิก refresh token ปัจจุบัน) */
router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.status(400).json({ message: 'Missing refresh token' });

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);
    if (user && user.refreshToken === refreshToken) {
      user.refreshToken = null;
      await user.save();
    }
    return res.json({ message: 'Logged out' });
  } catch {
    return res.json({ message: 'Logged out' });
  }
});

module.exports = router;
