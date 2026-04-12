import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

// Build headers, injecting CF Turnstile token when available
const buildHeaders = (cfToken) => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  ...(cfToken ? { 'X-CF-Token': cfToken } : {}),
});


const postJsonData = async (jsonData, cfToken = null) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/new`, jsonData, { headers: buildHeaders(cfToken) });
    if (response.status !== 200) {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
    return response.data; // Assuming the API returns { id: 'uuid', created_at: 'timestamp', expires_at: 'timestamp' }
  } catch (error) {
    console.error('Error posting JSON data:', error);
    throw error;
  }
};


const getSharedJson = async (uuid, cfToken = null) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fetch/${uuid}`, { headers: buildHeaders(cfToken) });
    if (response.status !== 200) {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
    return response.data; // Assuming the API returns the JSON content directly
  } catch (error) {
    console.error('Error fetching shared JSON:', error);
    throw error;
  }
};


export { postJsonData, getSharedJson };
