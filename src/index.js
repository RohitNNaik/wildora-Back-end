require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const photosRoutes = require('./routes/photos');
const postsRoutes = require('./routes/posts');
const destRoutes = require('./routes/destinations');
const recRoutes = require('./routes/recommendations');
const aiRoutes = require('./routes/ai');
const devRoutes = require('./routes/dev');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/auth', authRoutes);
app.use('/upload-photo', photosRoutes);
app.use('/create-post', postsRoutes);
app.use('/feed', postsRoutes);
app.use('/destinations', destRoutes);
app.use('/recommendations', recRoutes);
app.use('/ai', aiRoutes);
// Mount dev-only routes when not in production or when explicitly enabled
if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_DEV_ROUTES === 'true') {
  app.use('/dev', devRoutes);
  console.log('Dev routes enabled at /dev');
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Wildora backend running on port ${PORT}`);
});
