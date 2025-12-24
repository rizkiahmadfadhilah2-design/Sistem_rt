import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:3000"
})

// ======================
// LOGIN
// ======================
export const login = async (username, password) => {
  const res = await api.post("/auth/login", {
    username,
    password
  })
  return res.data
}

// ======================
// AUTO TOKEN (INTERCEPTOR)
// ======================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
