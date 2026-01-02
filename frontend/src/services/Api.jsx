import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

// AUTO TOKEN
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/* =====================
   AUTH SERVICE
===================== */
export const login = (data) => {
  return api.post("/auth/login", data)
}

export default api
