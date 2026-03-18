const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/token', (req, res) => {
  if (process.env.NODE_ENV === 'production' && process.env.ENABLE_DEV_ROUTES !== 'true') {
    return res.status(403).json({ error: 'Dev routes disabled in production' });
  }
  const body = req.body || {};
  const uid = body.uid || 'dev-user';
  const email = body.email || 'dev@example.com';
  const expiresIn = body.expiresIn || '7d';
  const extra = body.extra || {};
  const payload = Object.assign({ uid, email }, extra);
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'change_me', { expiresIn });
  res.json({ token, payload, expiresIn });
});

module.exports = router;
