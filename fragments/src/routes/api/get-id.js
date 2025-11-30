// src/routes/api/get-id.js

/**
 * GET /v1/fragments/:id - Return raw fragment data
 */

const Fragment = require('../../model/fragments');

module.exports = async (req, res) => {
  try {
    const id = req.params.id;

    // Use Fragment.byId (handles hashing internally)
    const fragment = await Fragment.byId(req.user, id);

    if (!fragment) {
      return res.status(404).json({
        status: 'error',
        message: `Fragment ${id} not found`
      });
    }

    // Read data
    const data = await fragment.getData();

    if (!data) {
      return res.status(404).json({
        status: 'error',
        message: `No data for fragment ${id}`
      });
    }

    // Set correct content type
    res.setHeader('Content-Type', fragment.type);

    return res.status(200).send(data);

  } catch (err) {
    console.error('GET /v1/fragments/:id failed:', err);
    res.status(500).json({
      status: 'error',
      message: 'Could not fetch fragment'
    });
  }
};
