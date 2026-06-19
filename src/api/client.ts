import axios from 'axios';
import { tokenManager } from '../utils/tokenManager';
import { parseApiError } from '../utils/errorHandler';
import { logger } from '../utils/logger';

// NOTE: react-native-ssl-pinning architecture is commented out to prevent
// blocking development on the emulator without real SSL certificates.
/*
import { fetch as pinnedFetch } from 'react-native-ssl-pinning';
export const secureFetch = (url, options) => {
  return pinnedFetch(url, {
    ...options,
    sslPinning: { certs: ['my_backend_cert'] }
  });
};
*/

export const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL || 'http://localhost:3000/api', // Fallback for safety
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - attach JWT
apiClient.interceptors.request.use(async (config) => {
  const token = await tokenManager.getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  logger.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Response interceptor - refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    logger.error(`[API Error] ${error.config?.url}`, error);
    
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      const newToken = await tokenManager.refreshToken();
      if (newToken) {
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(error.config);
      }
    }
    return Promise.reject(parseApiError(error));
  }
);
