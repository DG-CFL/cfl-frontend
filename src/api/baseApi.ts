import axios from 'axios'
import { getAuth } from 'firebase/auth'
import { camelToSnake, snakeToCamel } from './utils/utils'

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + "/api/v1",
  headers: {}, withCredentials: true 
})

// Attach jwt to request headers
api.interceptors.request.use(async (config) => {
  const auth = getAuth()
  const user = auth.currentUser
  if (user) {
    const token = await user.getIdToken()
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Convert request body and params from camel case to snake case
api.interceptors.request.use((config) => {
    if (config.data && typeof config.data === 'object') {
        config.data = camelToSnake(config.data);
    }
    if (config.params && typeof config.params === 'object') {
        config.params = camelToSnake(config.params);
    }
    return config;
});

// Convert request body from snake case to camel case
api.interceptors.response.use(
  (res) => {
    if (res.data && typeof res.data === 'object') {
      res.data = snakeToCamel(res.data)
    } 
    return res
  }, error => Promise.reject(error)
)
