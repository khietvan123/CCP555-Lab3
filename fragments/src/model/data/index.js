// src/model/data/index.js

// Only use AWS backend when full AWS config is present; otherwise default to in-memory.
const hasAwsConfig =
  process.env.AWS_REGION &&
  process.env.AWS_S3_BUCKET_NAME &&
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY;

module.exports = hasAwsConfig ? require('./aws') : require('./memory');
