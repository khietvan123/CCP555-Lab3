// src/routes/api/post.js
const Fragments = require('../../model/fragments');
const { createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  try {
    const ownerId = req.user;
    const type = req.get('Content-Type');

    // Supported: text/* or application/json
    const isText = type && type.startsWith('text/');
    const isJson = type === 'application/json';

    if (!isText && !isJson) {
      return res
        .status(415)
        .json(createErrorResponse(415, 'Unsupported content type'));
    }

    

    // req.body ALREADY contains raw body because express.raw/text is used
    const data =
      typeof req.body === 'string'
        ? Buffer.from(req.body)
        : Buffer.isBuffer(req.body)
        ? req.body
        : Buffer.from(JSON.stringify(req.body));

    // Create + save metadata
    const fragment = new Fragments({ ownerId, type });
    fragment.save();

    // Save data
    await fragment.setData(data);

    const base = process.env.API_URL || 'http://localhost:8080';
    const location = `${base}/v1/fragments/${fragment.id}`;

    return res.status(201).location(location).json({
      status: 'ok',
      fragment: Fragments.expand(fragment),
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(createErrorResponse(500, 'Failed to create fragment'));
  }
};
