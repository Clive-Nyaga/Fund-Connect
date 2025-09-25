import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const campaignAPI = {
  getAll: () => api.get('/campaigns'),
  getById: (id) => api.get(`/campaigns/${id}`),
  create: (data) => api.post('/campaigns', data),
  getDonations: (id) => api.get(`/campaigns/${id}/donations`)
}

export const donationAPI = {
  create: (data) => api.post('/donations', {
    title: data.title || 'Donation',
    paymentmethod: data.paymentmethod || 'card',
    amount: data.amount,
    campaign_id: data.campaignId
  })
}

export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/users', userData),
  checkSession: () => api.get('/check')
}

export default api