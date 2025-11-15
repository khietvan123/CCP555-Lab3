// src/routes/api/get-ext.js

/**
 * GET /v1/fragments/:id.ext
 * Convert markdown -> HTML
 */
const Fragment = require('../../model/fragments');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

module.exports = (req, res) => {
  try {
    const ownerId = req.user;
    const full = req.params.id;   // e.g.: "abc123.html"

    // extract id and extension
    const [id, ext] = full.split('.');

    const fragments = Fragment.byUser(ownerId);
    const fragment = fragments.find((f) => f.id === id);

    if (!fragment) {
      return res.status(404).json({
        status: 'error',
        message: 'Fragment not found',
      });
    }

    const data = fragment.getData();

    // Only one supported conversion for A2: markdown → html
    if (ext === 'html' && fragment.type === 'text/markdown') {
      const html = md.render(data.toString());
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(html);
    }

    // Unsupported conversion
    return res.status(415).json({
      status: 'error',
      message: `Conversion to .${ext} not supported`,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Conversion error' });
  }
};
