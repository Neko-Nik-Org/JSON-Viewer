import axios from 'axios';
import { API_BASE_URL, API_KEY } from '../config/constants';

// Build headers, injecting CF Turnstile token when available
const buildHeaders = (cfToken) => ({
  'Content-Type': 'application/json',
  'API-Key': API_KEY,
  ...(cfToken ? { 'X-CF-Token': cfToken } : {}),
});


const postJsonData = async (jsonData, cfToken = null) => {
  try {
    const response = await axios.post(API_BASE_URL, jsonData, { headers: buildHeaders(cfToken) });
    if (response.status !== 201) {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error('Error posting JSON data:', error);
    throw error;
  }
};


const getSharedJson = async (uuid, cfToken = null) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${uuid}`, { headers: buildHeaders(cfToken) });
    if (response.status !== 200) {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching shared JSON:', error);
    throw error;
  }
};


export { postJsonData, getSharedJson };
