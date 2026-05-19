const express = require('express');

const router = express.Router();

router.post('/register', (req, res) => {
  res.status(501).json({ error: 'Registration will be implemented in Phase 3.' });
});

router.post('/login', (req, res) => {
  res.status(501).json({ error: 'Login will be implemented in Phase 3.' });
});

module.exports = router;
