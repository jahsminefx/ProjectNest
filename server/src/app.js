const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const workspaceRoutes = require('./routes/workspace.routes');
const taskRoutes = require('./routes/task.routes');
const uploadRoutes = require('./routes/upload.routes');
const authenticate = require('./middleware/authenticate');
const requireWorkspaceMember = require('./middleware/requireWorkspaceMember');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/workspaces/:workspaceId/uploads', uploadRoutes);
app.use('/api/workspaces/:workspaceId/tasks', authenticate, requireWorkspaceMember, taskRoutes);
app.use('/api/workspaces', authenticate, workspaceRoutes);
app.use('/api/upload', uploadRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);

  const status = err.status || (err.name === 'MulterError' ? 400 : 500);

  res.status(status).json({
    error: err.message || 'Internal server error'
  });
});

app.listen(port, () => {
  console.log(`ProjectNest API listening on port ${port}`);
});

module.exports = app;
