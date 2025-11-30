// src/model/data/index.js

// If AWS_REGION is set in environment variables,
// use the AWS backend (S3). Otherwise use in-memory backend.
module.exports = process.env.AWS_REGION
  ? require('./aws')
  : require('./memory');
