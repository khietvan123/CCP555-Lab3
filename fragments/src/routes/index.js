const express = require('express');
const router = express.Router();
const { authenticate } = require('../auth');
const { version, author } = require('../../package.json');

// Root route
router.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.status(200).json({
    status: 'ok',
    author,
    version,
    githubUrl: 'github.com/khietvan123/CCP555-Lab3'
  });
});

// Health check
router.get('/health', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.status(200).json({ status: 'ok' });
});

// MOUNT API HERE
router.use('/v1', authenticate(), require('./api'));

module.exports = router;
