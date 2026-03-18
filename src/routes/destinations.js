const express = require('express');
const path = require('path');
const { readJSON } = require('../services/storage');

const router = express.Router();
const destPath = path.join(__dirname, '..', '..', 'data', 'destinations.json');

router.get('/', (req, res) => {
  const items = readJSON(destPath, []);
  res.json(items);
});

module.exports = router;
