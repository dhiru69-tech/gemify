import axios from 'axios'

// Production: VITE_API_URL env variable set in Vercel
// Local dev: vite proxy to localhost:8000
const BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({ baseURL: BASE_URL, timeout: 20000 })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('g_access')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refresh = localStorage.getItem('g_refresh')
        if (!refresh) throw new Error('no refresh')
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refresh_token: refresh })
        localStorage.setItem('g_access', data.access_token)
        localStorage.setItem('g_refresh', data.refresh_token)
        original.headers.Authorization = `Bearer ${data.access_token}`
        return api(original)
      } catch {
        localStorage.removeItem('g_access')
        localStorage.removeItem('g_refresh')
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api
