const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../config/db');
const { signToken } = require('../utils/jwt');
const slugify = require('../utils/slugify');

const PASSWORD_MIN_LENGTH = 8;

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function assertRegistrationInput({ name, email, password }) {
  if (!String(name || '').trim()) {
    const error = new Error('Name is required');
    error.status = 400;
    throw error;
  }

  if (!normalizeEmail(email).includes('@')) {
    const error = new Error('A valid email is required');
    error.status = 400;
    throw error;
  }

  if (String(password || '').length < PASSWORD_MIN_LENGTH) {
    const error = new Error(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
    error.status = 400;
    throw error;
  }
}

async function registerUser({ name, email, password, workspaceName }) {
  assertRegistrationInput({ name, email, password });

  const normalizedEmail = normalizeEmail(email);
  const displayName = String(name).trim();
  const defaultWorkspaceName = String(workspaceName || '').trim() || `${displayName}'s Workspace`;
  const workspaceSlug = `${slugify(defaultWorkspaceName)}-${crypto.randomBytes(3).toString('hex')}`;
  const passwordHash = await bcrypt.hash(password, 12);
  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    const userResult = await client.query(
      `INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) DO NOTHING
      RETURNING id, name, email`,
      [displayName, normalizedEmail, passwordHash]
    );

    if (userResult.rowCount === 0) {
      const error = new Error('A user with this email already exists');
      error.status = 409;
      throw error;
    }

    const user = userResult.rows[0];

    const workspaceResult = await client.query(
      `INSERT INTO workspaces (name, slug, owner_id)
      VALUES ($1, $2, $3)
      RETURNING id, name, slug, owner_id`,
      [defaultWorkspaceName, workspaceSlug, user.id]
    );

    const workspace = workspaceResult.rows[0];

    await client.query(
      `INSERT INTO memberships (user_id, workspace_id, role)
      VALUES ($1, $2, 'owner')`,
      [user.id, workspace.id]
    );

    await client.query('COMMIT');

    return {
      token: signToken(user),
      user: publicUser(user),
      workspace
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function loginUser({ email, password }) {
  const normalizedEmail = normalizeEmail(email);

  const result = await db.query(
    `SELECT id, name, email, password_hash
    FROM users
    WHERE email = $1`,
    [normalizedEmail]
  );

  const user = result.rows[0];
  const passwordsMatch = user
    ? await bcrypt.compare(String(password || ''), user.password_hash)
    : false;

  if (!passwordsMatch) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  return {
    token: signToken(user),
    user: publicUser(user)
  };
}

async function getUserById(userId) {
  const result = await db.query(
    `SELECT id, name, email
    FROM users
    WHERE id = $1`,
    [userId]
  );

  return result.rows[0] ? publicUser(result.rows[0]) : null;
}

module.exports = {
  getUserById,
  loginUser,
  registerUser
};
