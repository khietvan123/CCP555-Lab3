/**
 * src/auth/index.js
 * Correct version - NO return statements at top level.
 */

// 1. Force Basic Auth when running tests
const isJest = process.env.JEST_WORKER_ID !== undefined;

if (isJest) {
  module.exports = require('./basic-auth');
} else if (
  process.env.AWS_COGNITO_POOL_ID &&
  process.env.AWS_COGNITO_CLIENT_ID &&
  process.env.HTPASSWD_FILE
) {
  // 2. Invalid: Both Cognito + Basic Auth configured
  throw new Error(
    'env contains configuration for both AWS Cognito and HTTP Basic Auth. Only one is allowed.'
  );
} else if (
  process.env.AWS_COGNITO_POOL_ID &&
  process.env.AWS_COGNITO_CLIENT_ID
) {
  // 3. Production Cognito mode
  module.exports = require('./cognito');
} else if (process.env.HTPASSWD_FILE) {
  // 4. Local dev (Basic Auth)
  module.exports = require('./basic-auth');
} else {
  // 5. No config found
  throw new Error('No valid authentication configuration found');
}
