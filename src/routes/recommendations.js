const express = require('express');
const path = require('path');
const { readJSON } = require('../services/storage');
const router = express.Router();

const destPath = path.join(__dirname, '..', '..', 'data', 'destinations.json');

// Very small recommendation stub: returns destinations matching a 'tag' query or random
router.get('/', (req, res) => {
  const tag = req.query.tag;
  const items = readJSON(destPath, []);
  if (tag) {
    const filtered = items.filter(d => d.tags && d.tags.includes(tag));
    return res.json(filtered);
  }
  // default: return top 3 or shuffled
  const shuffled = items.slice().sort(() => 0.5 - Math.random());
  res.json(shuffled.slice(0, 3));
});

module.exports = router;
