const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(501).json({ error: 'Task routes will be implemented in Phase 2.' });
});

module.exports = router;
