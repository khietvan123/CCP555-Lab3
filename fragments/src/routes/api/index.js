// src/routes/api/index.js
const express = require('express');
const router = express.Router();

// GET all fragments
router.get('/fragments', require('./get'));

// POST new fragment
router.post('/fragments', require('./post'));

// GET a fragment by ID
router.get('/fragments/:id', require('./get-id'));

// GET fragment metadata
router.get('/fragments/:id/info', require('./get-info'));

// GET fragment conversion
router.get('/fragments/:id.:ext', require('./get-ext'));

// DELETE fragment — MUST BE LAST
router.delete('/fragments/:id', require('./delete-id'));

module.exports = router;
