const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(501).json({ error: 'Workspace routes will be implemented after Phase 1 confirmation.' });
});

module.exports = router;
