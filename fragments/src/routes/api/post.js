// src/routes/api/post.js
const Fragments = require('../../model/fragments');

/**
 * POST /v1/fragments
 * Creates a new text/* or application/json fragment
 */
module.exports = async (req, res) => {
  try {
    const ownerId = req.user;
    const type = req.headers['content-type'];

    // Validate type
    if (!type.startsWith('text/')) {
      return res.status(415).json({
        status: 'error',
        message: 'Unsupported type: only text/* or application/json allowed',
      });
    }

    // Read body as buffer
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const data = Buffer.concat(chunks);

    // Create metadata
    const fragment = new Fragments({ ownerId, type });

    // Save metadata + data
    fragment.save();
    fragment.setData(data);

    // Build Location header
    const location = `/v1/fragments/${fragment.id}`;

    res.status(201)
      .location(location)
      .json({
        status: 'ok',
        fragment: Fragments.expand(fragment),
      });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Failed to create fragment' });
  }
};