const express = require('express');
const jwt = require('jsonwebtoken');
const admin = require('../config/firebase');
const { verifyFirebaseIdToken } = require('../middleware/auth');

const router = express.Router();

router.post('/session', verifyFirebaseIdToken, (req, res) => {
  const firebaseUser = req.firebaseUser;
  const payload = { uid: firebaseUser.uid, email: firebaseUser.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'change_me', { expiresIn: '7d' });
  res.json({ token, user: payload });
});

router.post('/signup', async (req, res) => {
  const { email, password, displayName } = req.body;
  if (!admin || !admin.auth) return res.status(500).json({ error: 'Firebase not configured' });
  try {
    const userRecord = await admin.auth().createUser({ email, password, displayName });
    const payload = { uid: userRecord.uid, email: userRecord.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'change_me', { expiresIn: '7d' });
    res.json({ token, user: payload });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
