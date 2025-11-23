// src/routes/api/get-id.js

/**
 * GET /v1/fragments/:id
 * Return raw fragment data
 */

const crypto = require('crypto');
const Fragment = require('../../model/fragments');

module.exports = (req, res) => {
  try {
    // ⭐ FIX: ownerId must be hashed (POST stores fragments under hashed ownerId)
    const ownerId = crypto.createHash('sha256')
      .update(req.user)
      .digest('hex');

    const id = req.params.id;

    const fragments = Fragment.byUser(ownerId);

    // Look for this fragment
    const fragment = fragments.find((f) => f.id === id);

    if (!fragment) {
      return res.status(404).json({
        status: 'error',
        message: 'Fragment not found',
      });
    }

    const data = fragment.getData();

    res.setHeader('Content-Type', fragment.type);
    res.status(200).send(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Could not get fragment'
    });
  }
};
