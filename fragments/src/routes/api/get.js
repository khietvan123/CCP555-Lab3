/* eslint-disable no-unused-vars */
// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */

const crypto = require('crypto');
const Fragment = require('../../model/fragments');

// src/routes/api/get.js

module.exports = async (req, res) => {
  try {
    // DO NOT HASH req.user
    const fragments = await Fragment.byUser(req.user);

    if (!Array.isArray(fragments)) {
      return res.status(200).json({
        status: 'ok',
        fragments: []
      });
    }

    if (req.query.expand === '1') {
      return res.status(200).json({
        status: 'ok',
        fragments: fragments.map((f) => Fragment.expand(f)),
      });
    }

    return res.status(200).json({
      status: 'ok',
      fragments: fragments.map((f) => f.id),
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Unable to fetch fragments',
    });
  }
};

