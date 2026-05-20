import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

setAuthToken(localStorage.getItem('projectnest_token'));

export async function registerUser(payload) {
  const response = await api.post('/auth/register', payload);
  return response.data;
}

export async function loginUser(credentials) {
  const response = await api.post('/auth/login', credentials);
  return response.data;
}

export async function fetchCurrentUser() {
  const response = await api.get('/auth/me');
  return response.data.user;
}

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

export async function uploadTaskAttachment(workspaceId, taskId, file) {
  const formData = new FormData();
  formData.append('attachment', file);
  formData.append('taskId', taskId);
  const params = new URLSearchParams({ workspaceId, taskId });

  const response = await api.post(`/upload?${params.toString()}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return response.data;
}

export default api;
