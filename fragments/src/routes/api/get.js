// src/routes/api/get.js
 
/**
 * Get a list of fragments for the current user
 */
const Fragment = require('../../model/fragments');
module.exports = (req, res) => {
  try {
    const ownerId = req.user; // set by authenticate middleware
    const fragments = Fragment.byUser(ownerId);

    // expand=1 → return full metadata
    if (req.query.expand === '1') {
      return res.status(200).json({
        status: 'ok',
        fragments: fragments.map((f) => Fragment.expand(f)),
      });
    }

    // default → only return IDs
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