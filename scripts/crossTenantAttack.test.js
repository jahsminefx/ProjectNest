const axios = require('axios');

const baseURL = process.env.TEST_API_URL || process.env.API_URL || 'http://localhost:3100/api';

const config = {
  attackerEmail: process.env.ATTACKER_EMAIL || 'avery@projectnest.test',
  attackerPassword: process.env.ATTACKER_PASSWORD || 'Password123!',
  victimWorkspaceId: process.env.VICTIM_WORKSPACE_ID || '10000000-0000-0000-0000-000000000002',
  victimTaskId: process.env.VICTIM_TASK_ID || '30000000-0000-0000-0000-000000000005'
};

async function expectForbidden(label, request) {
  try {
    const response = await request();
    throw new Error(`${label} returned ${response.status}; expected 403`);
  } catch (error) {
    const status = error.response?.status;

    if (status !== 403) {
      throw new Error(`${label} returned ${status || error.message}; expected 403`);
    }

    console.log(`PASS ${label}: 403`);
  }
}

async function run() {
  const client = axios.create({ baseURL });
  const loginResponse = await client.post('/auth/login', {
    email: config.attackerEmail,
    password: config.attackerPassword
  });

  if (loginResponse.status !== 200 || !loginResponse.data.token) {
    throw new Error(`Login failed with status ${loginResponse.status}`);
  }

  const attacker = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${loginResponse.data.token}`
    }
  });

  await expectForbidden('cross-tenant task list', () =>
    attacker.get(`/workspaces/${config.victimWorkspaceId}/tasks`)
  );

  await expectForbidden('cross-tenant task status update', () =>
    attacker.patch(`/workspaces/${config.victimWorkspaceId}/tasks/${config.victimTaskId}/status`, {
      status: 'DONE'
    })
  );

  await expectForbidden('cross-tenant task delete', () =>
    attacker.delete(`/workspaces/${config.victimWorkspaceId}/tasks/${config.victimTaskId}`)
  );

  console.log('Cross-tenant attack checks passed.');
}

run().catch((error) => {
  console.error(`Cross-tenant attack checks failed: ${error.message}`);
  process.exit(1);
});
