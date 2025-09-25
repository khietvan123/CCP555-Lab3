// src/auth.js

/**
 * Auth setup for the app.
 *
 * - In normal dev/prod, we require AWS_COGNITO_POOL_ID and AWS_COGNITO_CLIENT_ID.
 * - In test mode (NODE_ENV === 'test'), we install a dummy strategy so tests
 *   can load the app without real Cognito configuration.
 */

const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const logger = require('./logger');

const isTest = process.env.NODE_ENV === 'test';

// If we're running tests, use a dummy strategy so tests don't need Cognito.
if (isTest) {
  logger.info('Auth: running in test mode, installing dummy auth strategy');

  passport.use(
    new BearerStrategy((token, done) => {
      // Accept any token in tests, return a fake user object.
      // Keep the shape simple: { sub, username, scopes } - adapt if your app expects other fields.
      const fakeUser = { sub: 'test-user', username: 'test-user' };
      return done(null, fakeUser, null);
    })
  );

  module.exports = passport;
  return;
}

// For non-test environments, require the Cognito env vars.
const { CognitoJwtVerifier } = require('aws-jwt-verify');

if (!(process.env.AWS_COGNITO_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID)) {
  // Crash early and with a clear message so the cause is obvious
  throw new Error(
    'Missing required env vars for Cognito auth: AWS_COGNITO_POOL_ID and AWS_COGNITO_CLIENT_ID'
  );
}

// Create Cognito verifier (will throw more informative errors if pool id / client id are malformed)
const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: process.env.AWS_COGNITO_POOL_ID,
  clientId: process.env.AWS_COGNITO_CLIENT_ID,
  tokenUse: 'id',
});

// Passport Bearer strategy that verifies tokens via Cognito
passport.use(
  new BearerStrategy(async (token, done) => {
    try {
      const payload = await jwtVerifier.verify(token);
      // Add any mapping from payload to user object you need
      const user = { sub: payload.sub, username: payload['cognito:username'] || payload.email };
      return done(null, user, null);
    } catch (err) {
      logger.warn({ err }, 'Auth: token verification failed');
      return done(null, false);
    }
  })
);

module.exports = passport;
