// src/routes/api/get-info.js

/**
 * GET /v1/fragments/:id/info
 * Return metadata only
 */
const Fragment = require('../../model/fragments');

module.exports = (req, res) => {
  try {
    const ownerId = req.user;
    const id = req.params.id;

    const fragments = Fragment.byUser(ownerId);
    const fragment = fragments.find((f) => f.id === id);

    if (!fragment) {
      return res.status(404).json({
        status: 'error',
        message: 'Fragment not found',
      });
    }

    res.status(200).json({
      status: 'ok',
      fragment: Fragment.expand(fragment),
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Could not get fragment info' });
  }
};