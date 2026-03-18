const express = require('express');
const router = express.Router();
const { verifyServerJWT } = require('../middleware/auth');

// AI analysis stub
router.post('/analyze', verifyServerJWT, (req, res) => {
  const { imageUrl, text } = req.body;
  // Placeholder: real implementation would call a vision/model API.
  const result = {
    imageUrl: imageUrl || null,
    text: text || null,
    labels: ['outdoor', 'landscape'],
    sentiment: 'neutral',
    summary: 'Stub analysis — replace with real AI integration',
  };
  res.json(result);
});

module.exports = router;
