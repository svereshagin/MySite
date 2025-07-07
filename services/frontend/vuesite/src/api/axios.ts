import axios from 'axios';
import { setupCache, buildWebStorage } from 'axios-cache-interceptor';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_STRAPI_API_URL,
  withCredentials: true,
})

setupCache(apiClient, {
  ttl:  88600,// cache for 3 seconds
  storage: buildWebStorage(localStorage, 'axios-cache:'),
  interpretHeader:false
})

export default apiClient;
