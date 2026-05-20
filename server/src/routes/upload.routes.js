const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const authenticate = require('../middleware/authenticate');
const requireWorkspaceMember = require('../middleware/requireWorkspaceMember');
const { attachFileToTask } = require('../services/task.service');

const router = express.Router({ mergeParams: true });

const allowedMimeTypes = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
]);

const uploadRoot = path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'server/uploads');
const maxUploadBytes = Number(process.env.MAX_UPLOAD_BYTES || 10 * 1024 * 1024);

function workspaceUploadDir(workspaceId) {
  return path.join(uploadRoot, workspaceId);
}

function removeUploadedFile(file) {
  if (file?.path) {
    fs.unlink(file.path, () => {});
  }
}

const storage = multer.diskStorage({
  destination(req, file, callback) {
    const destination = workspaceUploadDir(req.workspaceId);
    fs.mkdirSync(destination, { recursive: true });
    callback(null, destination);
  },
  filename(req, file, callback) {
    const extension = path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, '');
    callback(null, `${Date.now()}-${crypto.randomUUID()}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: maxUploadBytes },
  fileFilter(req, file, callback) {
    if (!allowedMimeTypes.has(file.mimetype)) {
      const error = new Error('Unsupported file type');
      error.status = 400;
      return callback(error);
    }

    return callback(null, true);
  }
});

router.post('/', authenticate, requireWorkspaceMember, upload.single('attachment'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'attachment file is required' });
    }

    const fileUrl = `/api/workspaces/${req.workspaceId}/uploads/${req.file.filename}`;
    const taskId = req.body.taskId || req.query.taskId;
    let task = null;

    if (taskId) {
      task = await attachFileToTask(req.workspaceId, taskId, fileUrl);

      if (!task) {
        removeUploadedFile(req.file);
        return res.status(404).json({ error: 'Task not found in this workspace' });
      }
    }

    return res.status(201).json({
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: fileUrl
      },
      task
    });
  } catch (error) {
    removeUploadedFile(req.file);
    return next(error);
  }
});

router.get('/:filename', authenticate, requireWorkspaceMember, (req, res, next) => {
  const filename = path.basename(req.params.filename);
  const directory = workspaceUploadDir(req.workspaceId);
  const filePath = path.resolve(directory, filename);

  if (!filePath.startsWith(path.resolve(directory))) {
    return res.status(400).json({ error: 'Invalid filename' });
  }

  return res.download(filePath, (error) => {
    if (error) {
      return next(error);
    }

    return null;
  });
});

module.exports = router;
