const jwt = require('jsonwebtoken');
const admin = require('../config/firebase');

function verifyServerJWT(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing Authorization header' });
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Invalid Authorization format' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'change_me');
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

async function verifyFirebaseIdToken(req, res, next) {
  const idToken = req.headers['x-firebase-token'] || req.body.idToken;
  if (!idToken) return res.status(401).json({ error: 'Missing Firebase ID token' });
  try {
    if (!admin || !admin.auth) throw new Error('Firebase not initialized');
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.firebaseUser = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid Firebase ID token', details: err.message });
  }
}

module.exports = { verifyServerJWT, verifyFirebaseIdToken };
