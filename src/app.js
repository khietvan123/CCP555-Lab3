// src/app.js
const express = require('express');
const passport = require('passport');

const { createErrorResponse } = require('./response');

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use((req, res) => {
  res.status(404).json(createErrorResponse(404, 'not found'));
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res
    .status(err.status || 500)
    .json(createErrorResponse(err.status || 500, err.message || 'internal server error'));
});

module.exports = app;
