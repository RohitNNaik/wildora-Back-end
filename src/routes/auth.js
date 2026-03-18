const express = require('express');
const jwt = require('jsonwebtoken');
const admin = require('../config/firebase');
const { verifyFirebaseIdToken, verifyServerJWT } = require('../middleware/auth');

const router = express.Router();

// Exchange Firebase ID token for server JWT
router.post('/session', verifyFirebaseIdToken, (req, res) => {
  const firebaseUser = req.firebaseUser;
  const payload = { uid: firebaseUser.uid, email: firebaseUser.email || null, phoneNumber: firebaseUser.phone_number || null };
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'change_me', { expiresIn: '7d' });
  res.json({ token, user: payload });
});

// Email/password signup (existing)
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

// Phone signup: create a Firebase user with a phone number
// Note: Firebase phone verification (SMS) is typically performed on the client.
// This endpoint allows creating a user record with a phoneNumber via admin SDK.
router.post('/signup-phone', async (req, res) => {
  const { phoneNumber, displayName } = req.body;
  if (!phoneNumber) return res.status(400).json({ error: 'Missing phoneNumber' });
  if (!admin || !admin.auth) return res.status(500).json({ error: 'Firebase not configured' });
  try {
    const userRecord = await admin.auth().createUser({ phoneNumber, displayName });
    const payload = { uid: userRecord.uid, phoneNumber: userRecord.phoneNumber };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'change_me', { expiresIn: '7d' });
    res.json({ token, user: payload });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create a Firebase custom token for a given uid (useful for server-driven sign-in flows)
// Protected: require a valid server JWT to prevent abuse
router.post('/custom-token', verifyServerJWT, async (req, res) => {
  const { uid } = req.body;
  if (!uid) return res.status(400).json({ error: 'Missing uid' });
  if (!admin || !admin.auth) return res.status(500).json({ error: 'Firebase not configured' });
  try {
    const customToken = await admin.auth().createCustomToken(uid);
    res.json({ customToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin user management endpoints (protected by server JWT)
router.get('/user/:uid', verifyServerJWT, async (req, res) => {
  const uid = req.params.uid;
  if (!admin || !admin.auth) return res.status(500).json({ error: 'Firebase not configured' });
  try {
    const user = await admin.auth().getUser(uid);
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.put('/user/:uid', verifyServerJWT, async (req, res) => {
  const uid = req.params.uid;
  const updates = req.body || {};
  if (!admin || !admin.auth) return res.status(500).json({ error: 'Firebase not configured' });
  try {
    const userRecord = await admin.auth().updateUser(uid, updates);
    res.json(userRecord);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/user/:uid', verifyServerJWT, async (req, res) => {
  const uid = req.params.uid;
  if (!admin || !admin.auth) return res.status(500).json({ error: 'Firebase not configured' });
  try {
    await admin.auth().deleteUser(uid);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
