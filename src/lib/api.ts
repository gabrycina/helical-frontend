import axios from 'axios';

const API_URL = import.meta.env.DEV ? 'http://localhost:8000/api/v1' : '/api/v1';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
});

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getModels = async (modelType?: string) => {
  const params = modelType ? { model_type: modelType } : {};
  const response = await api.get('/models', { params });
  return response.data;
};

export async function createSingleCellWorkflow(file: File, modelId: string) {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_URL}/workflows/single-cell?model_id=${modelId}`, {
    method: 'POST',
    body: formData,
  });
  
  return await response.json();
}

export async function getWorkflowStatus(workflowId: string) {
  const response = await fetch(`${API_URL}/workflows/${workflowId}`);
  if (!response.ok) {
    throw new Error('Failed to get workflow status');
  }
  const data = await response.json();
  return {
    ...data,
    // Ensure progress is a number between 0-100
    progress: data.progress || 0
  };
}

export const getDownloadUrl = (workflowId: string, resultId: string) => {
  return `${API_URL}/workflows/${workflowId}/results/${resultId}/download`;
};