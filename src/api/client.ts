import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Your PC's local IP - phone uses this, web uses localhost
const LAN_IP = '10.11.5.67';
const API_BASE_URL = Platform.OS === 'web'
  ? 'http://localhost:8000/api'
  : `http://${LAN_IP}:8000/api`;

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

let authToken: string | null = null;

export const setClientToken = (token: string | null) => {
  authToken = token;
};

// Load token from storage on startup
AsyncStorage.getItem('token').then((token) => {
  if (token) authToken = token;
});

client.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      authToken = null;
    }
    return Promise.reject(error);
  }
);

export default client;
