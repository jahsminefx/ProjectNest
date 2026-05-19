const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {
  res.status(501).json({ error: 'File uploads will be implemented in Phase 3.' });
});

module.exports = router;
