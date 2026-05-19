const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const workspaceRoutes = require('./routes/workspace.routes');
const taskRoutes = require('./routes/task.routes');
const uploadRoutes = require('./routes/upload.routes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/workspaces/:workspaceId/tasks', taskRoutes);
app.use('/api/upload', uploadRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

app.listen(port, () => {
  console.log(`ProjectNest API listening on port ${port}`);
});

module.exports = app;
