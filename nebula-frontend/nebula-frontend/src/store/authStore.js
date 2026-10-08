import { create } from 'zustand'
import axios from 'axios'

const API = 'http://localhost:3000/api/auth'

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('nebula_user')) || null,
  token: localStorage.getItem('nebula_token') || null,
  loading: false,
  error: null,

  register: async (name, email, password) => {
    set({ loading: true, error: null })
    try {
      const { data } = await axios.post(`${API}/register`, { name, email, password })
      localStorage.setItem('nebula_token', data.token)
      localStorage.setItem('nebula_user', JSON.stringify(data.user))
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      set({ user: data.user, token: data.token, loading: false })
      return true
    } catch (err) {
      set({ error: err.response?.data?.message || 'Registration failed', loading: false })
      return false
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const { data } = await axios.post(`${API}/login`, { email, password })
      localStorage.setItem('nebula_token', data.token)
      localStorage.setItem('nebula_user', JSON.stringify(data.user))
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      set({ user: data.user, token: data.token, loading: false })
      return true
    } catch (err) {
      set({ error: err.response?.data?.message || 'Login failed', loading: false })
      return false
    }
  },

  logout: () => {
    localStorage.removeItem('nebula_token')
    localStorage.removeItem('nebula_user')
    delete axios.defaults.headers.common['Authorization']
    set({ user: null, token: null })
  },

  clearError: () => set({ error: null }),
}))
