const admin = require('firebase-admin');
const fs = require('fs');

function initFirebase() {
  if (admin.apps.length) return admin;
  const saPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (!saPath || !fs.existsSync(saPath)) {
    console.warn('Firebase service account not found. Firebase auth endpoints will fail until configured.');
    return admin;
  }
  const serviceAccount = require(saPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  return admin;
}

module.exports = initFirebase();
