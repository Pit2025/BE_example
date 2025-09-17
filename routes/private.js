const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/profile', auth, async (req, res) => {
  // req.user มาจาก payload ของ JWT
  res.json({ message: 'ok', user: req.user });
});

module.exports = router;
