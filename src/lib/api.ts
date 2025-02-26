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

export const createSingleCellWorkflow = async (data: {
  input_file: string;
  model_id: string;
  embedding_mode: string;
}) => {
  const response = await api.post('/workflows/single-cell', data);
  return response.data;
};

export const getWorkflowStatus = async (workflowId: string) => {
  const response = await api.get(`/workflows/${workflowId}`);
  return response.data;
};

export const getDownloadUrl = (workflowId: string, resultId: string) => {
  return `${API_URL}/workflows/${workflowId}/results/${resultId}/download`;
};