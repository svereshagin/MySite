import axios from 'axios';
import { setupCache, buildWebStorage } from 'axios-cache-interceptor';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_STRAPI_API_URL,
  withCredentials: true,
})


export default apiClient;
