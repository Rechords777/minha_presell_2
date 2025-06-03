import axios from 'axios';

// Use environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Presell API calls
export const createPresell = async (presellData) => {
  try {
    const response = await apiClient.post('/presells/', presellData);
    return response.data;
  } catch (error) {
    console.error('Create presell API error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getPresells = async () => {
  try {
    const response = await apiClient.get('/presells/');
    return response.data;
  } catch (error) {
    console.error('Get presells API error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getPresellById = async (presellId) => {
  try {
    const response = await apiClient.get(`/presells/${presellId}`);
    return response.data;
  } catch (error) {
    console.error(`Get presell ${presellId} API error:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updatePresell = async (presellId, presellData) => {
  try {
    const response = await apiClient.put(`/presells/${presellId}`, presellData);
    return response.data;
  } catch (error) {
    console.error(`Update presell ${presellId} API error:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

export const deletePresell = async (presellId) => {
  try {
    const response = await apiClient.delete(`/presells/${presellId}`);
    return response.data;
  } catch (error) {
    console.error(`Delete presell ${presellId} API error:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

export default apiClient;
