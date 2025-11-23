const Fragments = require('../../model/fragments');

/**
 * POST /v1/fragments
 * Creates a new fragment
 */
module.exports = async (req, res) => {
  try {
    const ownerId = req.user;
    const type = req.headers['content-type'];

    const isText = type.startsWith('text/');
    const isJson = type === 'application/json';

    if (!isText && !isJson) {
      return res.status(415).json({
        status: 'error',
        message: 'Unsupported type: only text/* or application/json allowed',
      });
    }

    // Read raw request body
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const data = Buffer.concat(chunks);

    // Create fragment metadata + save
    const fragment = new Fragments({ ownerId, type });
    fragment.save();
    fragment.setData(data);

    const base = process.env.API_URL || 'http://localhost:8080';
    const location = `${base}/v1/fragments/${fragment.id}`;

    res.status(201)
      .location(location)
      .json({
        status: 'ok',
        fragment: Fragments.expand(fragment),
      });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create fragment'
    });
  }
};
