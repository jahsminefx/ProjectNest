import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
});

export async function fetchWorkspaces() {
  const response = await api.get('/workspaces');
  return response.data.workspaces;
}

export async function fetchWorkspace(workspaceId) {
  const response = await api.get(`/workspaces/${workspaceId}`);
  return response.data.workspace;
}

export async function fetchBoardTasks(workspaceId) {
  const response = await api.get(`/workspaces/${workspaceId}/tasks`);
  return response.data;
}

export async function patchTaskStatus(workspaceId, taskId, status) {
  const response = await api.patch(`/workspaces/${workspaceId}/tasks/${taskId}/status`, {
    status
  });
  return response.data.task;
}

export default api;
