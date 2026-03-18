const express = require('express');
const path = require('path');
const { readJSON, writeJSON } = require('../services/storage');
const { verifyServerJWT } = require('../middleware/auth');
const router = express.Router();

const postsPath = path.join(__dirname, '..', '..', 'data', 'posts.json');

router.post('/', verifyServerJWT, (req, res) => {
  const { content, imageUrl } = req.body;
  if (!content) return res.status(400).json({ error: 'Missing content' });
  const posts = readJSON(postsPath, []);
  const post = {
    id: Date.now().toString(),
    author: req.user || { uid: 'anonymous' },
    content,
    imageUrl: imageUrl || null,
    createdAt: new Date().toISOString(),
  };
  posts.unshift(post);
  writeJSON(postsPath, posts);
  res.json(post);
});

router.get('/', (req, res) => {
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '20', 10);
  const posts = readJSON(postsPath, []);
  const start = (page - 1) * limit;
  res.json({ page, limit, items: posts.slice(start, start + limit) });
});

module.exports = router;
