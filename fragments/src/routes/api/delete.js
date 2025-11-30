// src/routes/api/delete.js
const express = require('express');
const router = express.Router();
const Fragment = require('../../model/fragments');

router.delete('/:id', async (req, res) => {
  try {
    const ownerId = req.user;
    const id = req.params.id;

    const fragment = await Fragment.byId(ownerId, id);

    if (!fragment) {
      return res.status(404).json({ status: 'error', message: 'Fragment not found' });
    }

    await fragment.delete();

    return res.status(200).json({
      status: 'ok',
      message: 'Fragment deleted',
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'error', message: 'Unable to delete fragment' });
  }
});

module.exports = router;

