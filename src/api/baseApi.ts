import axios from 'axios'
import { getAuth } from 'firebase/auth'

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + "/api",
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
