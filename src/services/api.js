const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('fundconnect_token')
  console.log('Token from localStorage:', token)
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    ...options
  }
  
  console.log('API Request:', `${API_BASE_URL}${endpoint}`, config)
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
  const data = await response.json()
  console.log('API Response:', response.status, data)
  
  if (!response.ok) {
    console.error('API Error:', response.status, data)
    throw new Error(data.error || `HTTP ${response.status}`)
  }
  
  return { data }
}

export const campaignAPI = {
  getAll: () => apiRequest('/campaigns'),
  getById: (id) => apiRequest(`/campaigns/${id}`),
  create: (data) => apiRequest('/campaigns', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getDonations: (id) => apiRequest(`/campaigns/${id}/donations`),
  donate: (data) => donationAPI.create(data)
}

export const donationAPI = {
  create: (data) => apiRequest('/donations', {
    method: 'POST',
    body: JSON.stringify({
      title: data.title || 'Donation',
      paymentmethod: data.paymentmethod || 'card',
      amount: data.amount,
      campaign_id: data.campaignId
    })
  })
}

export const authAPI = {
  login: (credentials) => apiRequest('/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  register: (userData) => apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  checkSession: () => apiRequest('/check')
}

export default { get: apiRequest, post: apiRequest }